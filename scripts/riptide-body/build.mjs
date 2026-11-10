import fs from "fs";
import { render, triangulate } from "./objlib.mjs";
const [, , DL, OUT, PREVIEW, ARM_DOWN = "26", ARM_BACK = "12", FORE_BACK = "16"] = process.argv;

/* 1 · base mesh */
const lines = fs.readFileSync(`${DL}/base.obj`, "utf8").split("\n");
const V = []; const F = []; let g = "";
const KEEP = { body: 0, "helper-l-eye": 1, "helper-r-eye": 1 };
for (const l of lines) {
  if (l.startsWith("v ")) V.push(l.split(/\s+/).slice(1, 4).map(Number));
  else if (l.startsWith("g ")) g = l.slice(2).trim();
  else if (l.startsWith("f ") && g in KEEP) F.push({ v: l.split(/\s+/).slice(1).filter(Boolean).map((t) => +t.split("/")[0] - 1), grp: KEEP[g] });
}

/* 2 · shape: MakeHuman's default young adult male (equal ethnic mix) + light muscle tone */
const targets = [["caucasian-male-young", 1 / 3], ["african-male-young", 1 / 3], ["asian-male-young", 1 / 3], ["universal-male-young-maxmuscle-averageweight", 0.3]];
for (const [name, w] of targets)
  for (const l of fs.readFileSync(`${DL}/${name}.target`, "utf8").split("\n")) {
    if (!/^\d/.test(l)) continue;
    const [i, x, y, z] = l.trim().split(/\s+/).map(Number);
    V[i][0] += x * w; V[i][1] += y * w; V[i][2] += z * w;
  }

/* 3 · pose: lower the arms and bring the hands back beside the thighs, using MakeHuman's own skin weights */
const skel = JSON.parse(fs.readFileSync(`${DL}/default.mhskel`, "utf8"));
const weights = JSON.parse(fs.readFileSync(`${DL}/default_weights.mhw`, "utf8")).weights;
const joint = (name) => { const ids = skel.joints[name]; const c = [0, 0, 0]; ids.forEach((i) => V[i].forEach((q, k) => (c[k] += q / ids.length))); return c; };
const kids = {}; for (const [n, o] of Object.entries(skel.bones)) (kids[o.parent] ||= []).push(n);
const below = (n) => [n, ...(kids[n] || []).flatMap(below)];
const head = (b) => joint(skel.bones[b].head);
function rotateChain(root, rz, rx) {
  const p = head(root);
  const w = new Float32Array(V.length);
  for (const b of below(root)) for (const [i, x] of weights[b] || []) w[i] += x;
  const cz = Math.cos(rz), sz = Math.sin(rz), cx = Math.cos(rx), sx = Math.sin(rx);
  V.forEach((v, i) => {
    if (!w[i]) return;
    let [x, y, z] = [v[0] - p[0], v[1] - p[1], v[2] - p[2]];
    [x, y] = [x * cz - y * sz, x * sz + y * cz];
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    const t = Math.min(1, w[i]);
    v[0] += (x + p[0] - v[0]) * t; v[1] += (y + p[1] - v[1]) * t; v[2] += (z + p[2] - v[2]) * t;
  });
}
const down = (+ARM_DOWN * Math.PI) / 180, back = (+ARM_BACK * Math.PI) / 180;
for (const s of ["L", "R"]) {
  const side = Math.sign(head(`upperarm01.${s}`)[0]);
  rotateChain(`upperarm01.${s}`, -side * down, back);
  rotateChain(`lowerarm01.${s}`, 0, (+FORE_BACK * Math.PI) / 180);
  // feet a touch closer together
  rotateChain(`upperleg01.${s}`, -Math.sign(head(`upperleg01.${s}`)[0]) * (3 * Math.PI) / 180, 0);
}
// gather joints we need later, in final coordinates (computed after scaling)
const J = {};
for (const b of ["neck01", "neck02", "head", "spine01", "spine02", "spine03", "spine04", "spine05", "upperarm01.L", "upperarm01.R", "upperleg01.L", "upperleg01.R", "lowerleg01.L", "lowerleg01.R", "foot.L", "foot.R", "pelvis.L", "pelvis.R"]) J[b] = head(b);

/* 4 · keep only used vertices */
const map = new Map(); const P = [];
for (const f of F) f.v = f.v.map((i) => { if (!map.has(i)) { map.set(i, P.length); P.push([...V[i]]); } return map.get(i); });

/* 5 · one Catmull-Clark pass (boundary-aware) */
function subdivide(P, F) {
  const fp = F.map((f) => { const c = [0, 0, 0]; f.v.forEach((i) => P[i].forEach((q, k) => (c[k] += q / f.v.length))); return c; });
  const E = new Map(); const key = (a, b) => (a < b ? a * 1e6 + b : b * 1e6 + a);
  F.forEach((f, fi) => f.v.forEach((a, k) => { const b = f.v[(k + 1) % f.v.length]; const kk = key(a, b); if (!E.has(kk)) E.set(kk, { a, b, f: [] }); E.get(kk).f.push(fi); }));
  const NP = P.map((p) => [...p]);
  const eIdx = new Map();
  for (const [kk, e] of E) {
    const m = P[e.a].map((q, k) => (q + P[e.b][k]) / 2);
    const pt = e.f.length === 2 ? m.map((q, k) => (q * 2 + fp[e.f[0]][k] + fp[e.f[1]][k]) / 4) : m;
    eIdx.set(kk, NP.length); NP.push(pt);
  }
  const vf = P.map(() => []), ve = P.map(() => []);
  F.forEach((f, fi) => f.v.forEach((i) => vf[i].push(fi)));
  for (const e of E.values()) { ve[e.a].push(e); ve[e.b].push(e); }
  P.forEach((p, i) => {
    const bnd = ve[i].filter((e) => e.f.length === 1);
    if (bnd.length >= 2) {
      const o = bnd.map((e) => P[e.a === i ? e.b : e.a]);
      NP[i] = p.map((q, k) => q * 0.75 + (o[0][k] + o[1][k]) / 8);
    } else if (bnd.length === 0 && ve[i].length >= 3) {
      const n = ve[i].length;
      const Fa = [0, 0, 0], R = [0, 0, 0];
      vf[i].forEach((fi) => fp[fi].forEach((q, k) => (Fa[k] += q / vf[i].length)));
      ve[i].forEach((e) => [0, 1, 2].forEach((k) => (R[k] += (P[e.a][k] + P[e.b][k]) / 2 / n)));
      NP[i] = p.map((q, k) => (Fa[k] + 2 * R[k] + (n - 3) * q) / n);
    }
  });
  const NF = [];
  F.forEach((f, fi) => {
    const c = NP.length; NP.push(fp[fi]);
    const n = f.v.length;
    for (let k = 0; k < n; k++) {
      const a = f.v[k], nx = f.v[(k + 1) % n], pv = f.v[(k + n - 1) % n];
      NF.push({ v: [a, eIdx.get(key(a, nx)), c, eIdx.get(key(pv, a))], grp: f.grp });
    }
  });
  return [NP, NF];
}
let [SP, SF] = subdivide(P, F);

/* 6 · fit to the old figure: feet on y = 0, 3.56 tall, centred on the torso */
let minY = Infinity, maxY = -Infinity;
for (const p of SP) { minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); }
const S = 3.56 / (maxY - minY);
const torsoZ = (() => { let a = 0, n = 0; for (const p of SP) { const h = (p[1] - minY) / (maxY - minY); if (h > 0.55 && h < 0.7 && Math.abs(p[0]) < 1) { a += p[2]; n++; } } return a / n; })();
const tf = (p) => [p[0] * S, (p[1] - minY) * S, (p[2] - torsoZ) * S];
SP = SP.map(tf);
for (const k in J) J[k] = tf(J[k]);

/* 7 · triangles, normals */
const body = triangulate(SF.filter((f) => f.grp === 0).map((f) => f.v));
const eyes = triangulate(SF.filter((f) => f.grp === 1).map((f) => f.v));
const all = [...body, ...eyes];
const NRM = SP.map(() => [0, 0, 0]);
for (const [a, b, c] of all) {
  const u = SP[b].map((q, k) => q - SP[a][k]), w = SP[c].map((q, k) => q - SP[a][k]);
  const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
  for (const i of [a, b, c]) for (let k = 0; k < 3; k++) NRM[i][k] += n[k];
}
NRM.forEach((n) => { const l = Math.hypot(...n) || 1; n[0] /= l; n[1] /= l; n[2] /= l; });

/* 8 · ambient occlusion: depth maps from 96 directions, per-vertex visibility */
const AO = new Float32Array(SP.length), AOW = new Float32Array(SP.length);
const R = 640, DIRS = 96, ext = 1.95, cy = 1.78;
for (let d = 0; d < DIRS; d++) {
  const yv = 1 - (2 * (d + 0.5)) / DIRS, rr = Math.sqrt(1 - yv * yv), th = d * Math.PI * (3 - Math.sqrt(5));
  const dir = [Math.cos(th) * rr, yv, Math.sin(th) * rr];
  // basis: dir is the viewing axis (towards viewer)
  const up = Math.abs(dir[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
  const ax = [up[1] * dir[2] - up[2] * dir[1], up[2] * dir[0] - up[0] * dir[2], up[0] * dir[1] - up[1] * dir[0]]; const al = Math.hypot(...ax); ax.forEach((q, k) => (ax[k] = q / al));
  const ay = [dir[1] * ax[2] - dir[2] * ax[1], dir[2] * ax[0] - dir[0] * ax[2], dir[0] * ax[1] - dir[1] * ax[0]];
  const proj = (p) => { const q = [p[0], p[1] - cy, p[2]]; return [((q[0] * ax[0] + q[1] * ax[1] + q[2] * ax[2]) / ext * 0.5 + 0.5) * R, ((q[0] * ay[0] + q[1] * ay[1] + q[2] * ay[2]) / ext * 0.5 + 0.5) * R, q[0] * dir[0] + q[1] * dir[1] + q[2] * dir[2]]; };
  const S2 = SP.map(proj);
  const zb = new Float32Array(R * R).fill(-1e9);
  for (const [a, b, c] of all) {
    const A = S2[a], B = S2[b], C = S2[c];
    const area = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    if (Math.abs(area) < 1e-9) continue;
    const x0 = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0]))), x1 = Math.min(R - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    const y0 = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1]))), y1 = Math.min(R - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = ((B[0] - px) * (C[1] - py) - (B[1] - py) * (C[0] - px)) / area;
      const w1 = ((C[0] - px) * (A[1] - py) - (C[1] - py) * (A[0] - px)) / area;
      const w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const z = w0 * A[2] + w1 * B[2] + w2 * C[2];
      if (z > zb[y * R + x]) zb[y * R + x] = z;
    }
  }
  SP.forEach((p, i) => {
    const nd = NRM[i][0] * dir[0] + NRM[i][1] * dir[1] + NRM[i][2] * dir[2];
    if (nd <= 0) return;
    const q = proj([p[0] + NRM[i][0] * 0.006, p[1] + NRM[i][1] * 0.006, p[2] + NRM[i][2] * 0.006]);
    const x = Math.min(R - 1, Math.max(0, Math.floor(q[0]))), y = Math.min(R - 1, Math.max(0, Math.floor(q[1])));
    const vis = q[2] >= zb[y * R + x] - 0.004 ? 1 : 0;
    AO[i] += vis * nd; AOW[i] += nd;
  });
}
const ao8 = new Uint8Array(SP.length);
SP.forEach((_, i) => (ao8[i] = Math.round(Math.min(1, AOW[i] ? AO[i] / AOW[i] : 1) * 255)));

/* 9 · pain markers: raycast onto the skin from the angle each one faces */
function raycast(o, dir) {
  let best = Infinity;
  for (const [a, b, c] of body) {
    const A = SP[a], B = SP[b], C = SP[c];
    const e1 = B.map((q, k) => q - A[k]), e2 = C.map((q, k) => q - A[k]);
    const pv = [dir[1] * e2[2] - dir[2] * e2[1], dir[2] * e2[0] - dir[0] * e2[2], dir[0] * e2[1] - dir[1] * e2[0]];
    const det = e1[0] * pv[0] + e1[1] * pv[1] + e1[2] * pv[2];
    if (Math.abs(det) < 1e-12) continue;
    const inv = 1 / det, tv = o.map((q, k) => q - A[k]);
    const u = (tv[0] * pv[0] + tv[1] * pv[1] + tv[2] * pv[2]) * inv; if (u < 0 || u > 1) continue;
    const qv = [tv[1] * e1[2] - tv[2] * e1[1], tv[2] * e1[0] - tv[0] * e1[2], tv[0] * e1[1] - tv[1] * e1[0]];
    const v = (dir[0] * qv[0] + dir[1] * qv[1] + dir[2] * qv[2]) * inv; if (v < 0 || u + v > 1) continue;
    const t = (e2[0] * qv[0] + e2[1] * qv[1] + e2[2] * qv[2]) * inv;
    if (t > 0 && t < best) best = t;
  }
  return best;
}
const side = J["upperarm01.L"][0] > 0 ? "L" : "R";
const mid = (a, b) => a.map((q, k) => (q + b[k]) / 2);
const add = (a, b) => a.map((q, k) => q + b[k]);
const markers = {
  neck: [mid(J.neck01, J.neck02), Math.PI],
  shoulder: [add(J[`upperarm01.${side}`], [0, 0.03, 0]), -0.5],
  back: [["spine03", "spine04", "spine05"].map((k) => J[k]).sort((a, b) => Math.abs(a[1] - 2.17) - Math.abs(b[1] - 2.17))[0], Math.PI],
  hip: [add(J[`upperleg01.${side}`], [0.06, 0, 0]), -0.35],
  knee: [J[`lowerleg01.${side}`], -0.25],
  ankle: [J[`foot.${side}`], -0.3],
};
const out = {};
for (const [id, [target, f]] of Object.entries(markers)) {
  const dir = [-Math.sin(f), 0, Math.cos(f)];
  const o = target.map((q, k) => q + dir[k] * 3);
  const t = raycast(o, dir.map((q) => -q));
  const hit = o.map((q, k) => q - dir[k] * t + dir[k] * 0.012);
  out[id] = { pos: hit.map((q) => +q.toFixed(3)), facing: f, target: target.map((q) => +q.toFixed(3)) };
}

/* 10 · pack: header, int16 positions, uint16 indices (body then eyes), uint8 AO */
const mn = [0, 1, 2].map((k) => Math.min(...SP.map((p) => p[k]))), mx = [0, 1, 2].map((k) => Math.max(...SP.map((p) => p[k])));
const big = SP.length > 65535;
const head16 = new Float32Array([SP.length, body.length, eyes.length, big ? 1 : 0, ...mn, ...mx]);
const pos = new Int16Array(SP.length * 3);
SP.forEach((p, i) => p.forEach((q, k) => (pos[i * 3 + k] = Math.round(((q - mn[k]) / (mx[k] - mn[k])) * 65534 - 32767))));
const idx = new (big ? Uint32Array : Uint16Array)([...body.flat(), ...eyes.flat()]);
fs.writeFileSync(OUT, Buffer.concat([Buffer.from(head16.buffer), Buffer.from(pos.buffer), Buffer.from(idx.buffer), Buffer.from(ao8.buffer)]));
fs.writeFileSync(OUT + ".json", JSON.stringify({ markers: out, joints: J }, null, 1));
console.log("verts", SP.length, "tris", body.length, "+ eyes", eyes.length, "bytes", fs.statSync(OUT).size);
console.log(JSON.stringify(out));
const aoS = [...ao8].sort((a, b) => a - b); console.log("AO p5/p50/p95", aoS[Math.floor(aoS.length * 0.05)], aoS[Math.floor(aoS.length / 2)], aoS[Math.floor(aoS.length * 0.95)]);

if (PREVIEW) {
  const fit = [[-1.3, -0.05], [1.3, 3.65]];
  render(`${PREVIEW}-front.png`, SP, all, { W: 640, H: 900, fit });
  render(`${PREVIEW}-side.png`, SP, all, { W: 640, H: 900, yaw: Math.PI / 2, fit });
  render(`${PREVIEW}-back.png`, SP, all, { W: 640, H: 900, yaw: Math.PI, fit });
}
