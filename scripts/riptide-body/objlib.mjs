import fs from "fs";
import zlib from "zlib";
export function readObj(path, keep) {
  const src = fs.readFileSync(path, "utf8").split("\n");
  const v = []; const faces = {}; let g = "none";
  for (const l of src) {
    if (l.startsWith("v ")) v.push(l.split(/\s+/).slice(1, 4).map(Number));
    else if (l.startsWith("g ")) g = l.slice(2).trim();
    else if (l.startsWith("f ") && keep.includes(g)) (faces[g] ||= []).push(l.split(/\s+/).slice(1).filter(Boolean).map((t) => +t.split("/")[0] - 1));
  }
  return { v, faces };
}
/* Tiny z-buffer rasteriser → PNG, for eyeballing geometry without a GPU */
export function render(path, verts, tris, { W = 900, H = 1000, yaw = 0, light = [-0.4, 0.6, 0.7], fit } = {}) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const P = verts.map(([x, y, z]) => [x * cy + z * sy, y, -x * sy + z * cy]);
  let mn = [1e9, 1e9], mx = [-1e9, -1e9];
  for (const p of P) { mn[0] = Math.min(mn[0], p[0]); mx[0] = Math.max(mx[0], p[0]); mn[1] = Math.min(mn[1], p[1]); mx[1] = Math.max(mx[1], p[1]); }
  if (fit) { mn = fit[0]; mx = fit[1]; }
  const s = Math.min((W * 0.9) / (mx[0] - mn[0]), (H * 0.94) / (mx[1] - mn[1]));
  const ox = W / 2 - ((mn[0] + mx[0]) / 2) * s, oy = H / 2 + ((mn[1] + mx[1]) / 2) * s;
  const S = P.map(([x, y, z]) => [ox + x * s, oy - y * s, z]);
  // smooth vertex normals
  const N = verts.map(() => [0, 0, 0]);
  for (const [a, b, c] of tris) {
    const u = P[b].map((q, k) => q - P[a][k]), w = P[c].map((q, k) => q - P[a][k]);
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    for (const i of [a, b, c]) for (let k = 0; k < 3; k++) N[i][k] += n[k];
  }
  const L = light.map((q) => q / Math.hypot(...light));
  const zb = new Float32Array(W * H).fill(-1e9), img = Buffer.alloc(W * H * 3, 24);
  for (const [a, b, c] of tris) {
    const A = S[a], B = S[b], C = S[c];
    const area = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
    if (area >= 0) continue; // back-face (screen y is flipped)
    const x0 = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0]))), x1 = Math.min(W - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
    const y0 = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1]))), y1 = Math.min(H - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = ((B[0] - px) * (C[1] - py) - (B[1] - py) * (C[0] - px)) / area;
      const w1 = ((C[0] - px) * (A[1] - py) - (C[1] - py) * (A[0] - px)) / area;
      const w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const z = w0 * A[2] + w1 * B[2] + w2 * C[2];
      if (z <= zb[y * W + x]) continue;
      zb[y * W + x] = z;
      const n = [0, 1, 2].map((k) => w0 * N[a][k] + w1 * N[b][k] + w2 * N[c][k]); const nl = Math.hypot(...n) || 1;
      const d = Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / nl);
      const val = 40 + 200 * d;
      img[(y * W + x) * 3] = val; img[(y * W + x) * 3 + 1] = val * 0.86; img[(y * W + x) * 3 + 2] = val * 0.78;
    }
  }
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 3 + 1)] = 0; img.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3); }
  const crc = (buf) => { let c = ~0; for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); } return ~c >>> 0; };
  const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(td)); return Buffer.concat([len, td, cr]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
  fs.writeFileSync(path, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]));
}
export const triangulate = (faces) => faces.flatMap((f) => (f.length === 4 ? [[f[0], f[1], f[2]], [f[0], f[2], f[3]]] : [f]));
