import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "@/lib/gsap";

/*
 * The "where does it hurt?" figure.
 *
 * The body is the MakeHuman base mesh (CC0), shaped to an average adult and
 * posed offline, subdivided once and packed into a ~1 MB binary
 * (public/riptide/body.bin): int16 positions, uint16 indices, and a baked
 * per-vertex ambient-occlusion term. Skin is a physically based material
 * with a few additions: fine procedural surface texture, natural colour
 * variation, a soft red scatter where light turns to shadow, and the coral
 * glow that spreads over whichever area is selected.
 */

const NOISE = /* glsl */ `
  float rtHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float rtNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(rtHash(i), rtHash(i + vec3(1, 0, 0)), f.x), mix(rtHash(i + vec3(0, 1, 0)), rtHash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(rtHash(i + vec3(0, 0, 1)), rtHash(i + vec3(1, 0, 1)), f.x), mix(rtHash(i + vec3(0, 1, 1)), rtHash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z
    );
  }
  // fine skin texture, faded out before it gets smaller than a pixel
  float rtSkin(vec3 p) {
    float h = 0.0;
    float a = 0.5;
    float f = 190.0;
    for (int i = 0; i < 3; i++) {
      float w = 1.0 - smoothstep(0.35, 0.9, length(fwidth(p * f)));
      h += (rtNoise(p * f) - 0.5) * a * w;
      a *= 0.5;
      f *= 2.1;
    }
    return h;
  }
  // bump from a height derivative (after three.js perturbNormalArb)
  vec3 rtBump(vec3 surfPos, vec3 surfNorm, vec2 dHdxy, float faceDir) {
    vec3 vSigmaX = normalize(dFdx(surfPos.xyz));
    vec3 vSigmaY = normalize(dFdy(surfPos.xyz));
    vec3 vN = surfNorm;
    vec3 R1 = cross(vSigmaY, vN);
    vec3 R2 = cross(vN, vSigmaX);
    float fDet = dot(vSigmaX, R1) * faceDir;
    vec3 vGrad = sign(fDet) * (dHdxy.x * R1 + dHdxy.y * R2);
    return normalize(abs(fDet) * surfNorm - vGrad);
  }
`;

const V = (x, y, z) => new THREE.Vector3(x, y, z);

function token(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

/* Decode public/riptide/body.bin (see the header comment) */
function decode(buf) {
  const h = new Float32Array(buf, 0, 10);
  const [nV, nBody, nEyes, big] = h;
  const mn = [h[4], h[5], h[6]];
  const mx = [h[7], h[8], h[9]];
  let off = 40;
  const q = new Int16Array(buf, off, nV * 3);
  off += nV * 6;
  const pos = new Float32Array(nV * 3);
  for (let i = 0; i < nV * 3; i++) {
    const k = i % 3;
    pos[i] = mn[k] + ((q[i] + 32767) / 65534) * (mx[k] - mn[k]);
  }
  const nIdx = (nBody + nEyes) * 3;
  const bytes = big ? 4 : 2;
  const idx = big ? new Uint32Array(buf.slice(off, off + nIdx * bytes)) : new Uint16Array(buf.slice(off, off + nIdx * bytes));
  off += nIdx * bytes;
  const ao = new Uint8Array(buf.slice(off, off + nV));

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("ao", new THREE.BufferAttribute(ao, 1, true));
  geo.setIndex(new THREE.BufferAttribute(idx, 1));
  geo.addGroup(0, nBody * 3, 0);
  geo.addGroup(nBody * 3, nEyes * 3, 1);
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return { geo, nBody, nEyes, idx, pos };
}

export default class BodyScene {
  constructor({ canvas, wrap, regions, markers, model, reduced, onTap, onReady, onFail }) {
    this.canvas = canvas;
    this.wrap = wrap;
    this.regions = regions;
    this.markers = markers;
    this.reduced = reduced;
    this.onTap = onTap;

    this.yaw = 0.25;
    this.targetYaw = 0.25;
    this.sway = reduced ? 0 : 1;
    this.view = { dist: 9.4, y: 1.78 };
    this.selected = null;
    this.visible = false;
    this.disposed = false;
    this.loaded = false;

    const r = (this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" }));
    r.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    r.setClearColor(0x000000, 0);
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 0.85;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.VSMShadowMap;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);

    const pmrem = new THREE.PMREMGenerator(r);
    this.envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.envTex;

    this.colors = {
      skin: token("--rt-skin", "#c9967c"),
      blush: token("--rt-skin-blush", "#c0614c"),
      deep: token("--rt-skin-deep", "#5c2f22"),
      sheen: token("--rt-skin-sheen", "#ffb39a"),
      key: token("--rt-light-key", "#fff0e2"),
      cool: token("--rt-light-cool", "#a9c1e0"),
      iris: token("--rt-iris", "#3a2619"),
      fg: token("--rt-fg", "#f2ece3"),
      navy: token("--rt-navy", "#07101d"),
      coral: token("--rt-coral", "#ff6f4f"),
    };

    this.uniforms = {
      uHotColor: { value: this.colors.coral },
      uHot: { value: V(0, -10, 0) },
      uHotAmt: { value: 0 },
      uTime: { value: 0 },
      uIntro: { value: reduced ? 9 : -0.2 },
      uBlush: { value: this.colors.blush },
      uDeep: { value: this.colors.deep },
      uKeyView: { value: V(0, 0, 1) },
      uEyeL: { value: V(0, 0, 0) },
      uEyeR: { value: V(0, 0, 0) },
      uIris: { value: this.colors.iris },
    };

    this.buildLights();
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.meshes = [];
    this.buildFloor();

    this.hotLocal = V(0, -10, 0);
    this.tmp = V(0, 0, 0);
    this.keyDir = V(0, 0, 0);
    this.raycaster = new THREE.Raycaster();

    this.bind();
    this.resize();
    this.loop = this.loop.bind(this);
    this.clock = new THREE.Clock();
    this.raf = requestAnimationFrame(this.loop);
    this.introStarted = reduced;

    fetch(model)
      .then((res) => {
        if (!res.ok) throw new Error(`body model ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buf) => {
        if (this.disposed) return;
        this.buildFigure(buf);
        this.loaded = true;
        onReady && onReady();
      })
      .catch(() => {
        if (!this.disposed) onFail && onFail();
      });
  }

  /* ── Light ────────────────────────────────────────────────── */
  buildLights() {
    const c = this.colors;
    // soft key from front-left, casting the shadows that model the form
    const key = (this.key = new THREE.DirectionalLight(c.key, 3.3));
    key.position.set(-4.6, 5.2, 2.6);
    key.target.position.set(0, 1.8, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 9;
    key.shadow.blurSamples = 16;
    key.shadow.intensity = 0.7;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.025;
    Object.assign(key.shadow.camera, { left: -1.6, right: 1.6, top: 2.1, bottom: -2.1, near: 1, far: 16 });
    const fill = new THREE.DirectionalLight(c.cool, 0.08);
    fill.position.set(4, 1.2, 3.5);
    // rims: the brand's sunrise from behind-right, cool sky from behind-left
    const rimWarm = new THREE.DirectionalLight(c.coral, 1.5);
    rimWarm.position.set(3.5, 2.5, -4);
    const rimCool = new THREE.DirectionalLight(c.cool, 1.3);
    rimCool.position.set(-3.5, 3.2, -3.5);
    const hemi = new THREE.HemisphereLight(c.cool, c.navy, 0.08);
    for (const l of [key, key.target, fill, rimWarm, rimCool, hemi]) this.scene.add(l);
  }

  /* ── Materials ────────────────────────────────────────────── */
  patch(mat, kind) {
    const u = this.uniforms;
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
          attribute float ao;
          varying float vAo;
          varying vec3 vRtW;
          varying vec3 vRtO;`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
          vRtO = position;
          vAo = ao;
          vRtW = (modelMatrix * vec4(position, 1.0)).xyz;`
        );

      sh.fragmentShader = sh.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
          uniform vec3 uHotColor;
          uniform vec3 uHot;
          uniform float uHotAmt;
          uniform float uTime;
          uniform float uIntro;
          uniform vec3 uBlush;
          uniform vec3 uDeep;
          uniform vec3 uKeyView;
          uniform vec3 uEyeL;
          uniform vec3 uEyeR;
          uniform vec3 uIris;
          varying float vAo;
          varying vec3 vRtW;
          varying vec3 vRtO;
          float rtGlow;
          float rtRing;
          ${NOISE}`
        )
        .replace(
          "#include <clipping_planes_fragment>",
          `#include <clipping_planes_fragment>
          // intro: the body is revealed from the feet up
          float rtEdge = smoothstep(0.06, 0.0, abs(vRtW.y - uIntro)) * step(uIntro, 3.7);
          if (vRtW.y > uIntro && rtEdge < 0.01) discard;
          float rtD = distance(vRtW, uHot);
          rtGlow = smoothstep(0.42, 0.0, rtD) * uHotAmt;
          float rtT = fract(uTime * 0.55);
          rtRing = smoothstep(0.035, 0.0, abs(rtD - rtT * 0.75)) * (1.0 - rtT) * uHotAmt;`
        )
        .replace(
          "#include <color_fragment>",
          kind === "skin"
            ? `#include <color_fragment>
          // natural variation: slight mottling, warmer and redder in creases
          float rtM = rtNoise(vRtO * 3.2) * 0.6 + rtNoise(vRtO * 9.0) * 0.4;
          diffuseColor.rgb *= 0.96 + 0.08 * rtM;
          diffuseColor.rgb = mix(diffuseColor.rgb, uBlush, clamp((1.0 - vAo) * 0.55 + (rtM - 0.5) * 0.12, 0.0, 0.45));
          diffuseColor.rgb = mix(diffuseColor.rgb, uHotColor, rtGlow * rtGlow * 0.4);`
            : `#include <color_fragment>
          // iris and pupil, looking straight ahead (+z)
          vec3 rtC = vRtO.x > 0.0 ? uEyeL : uEyeR;
          float rtZ = normalize(vRtO - rtC).z;
          diffuseColor.rgb = mix(diffuseColor.rgb, uIris, smoothstep(0.78, 0.82, rtZ));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.01), smoothstep(0.94, 0.955, rtZ));`
        )
        .replace(
          "#include <roughnessmap_fragment>",
          kind === "skin"
            ? `#include <roughnessmap_fragment>
          roughnessFactor = clamp(roughnessFactor * (0.85 + 0.3 * rtNoise(vRtO * 40.0)), 0.25, 1.0);`
            : "#include <roughnessmap_fragment>"
        )
        .replace(
          "#include <normal_fragment_maps>",
          kind === "skin"
            ? `#include <normal_fragment_maps>
          float rtH = rtSkin(vRtO);
          normal = rtBump(-vViewPosition, normal, vec2(dFdx(rtH), dFdy(rtH)) * 0.28, faceDirection);`
            : "#include <normal_fragment_maps>"
        )
        .replace(
          "#include <aomap_fragment>",
          `#include <aomap_fragment>
          // baked ambient occlusion
          float rtAo = mix(1.0, vAo, 0.9);
          reflectedLight.indirectDiffuse *= rtAo;
          reflectedLight.indirectSpecular *= rtAo;
          reflectedLight.directDiffuse *= mix(1.0, rtAo, 0.45);
          reflectedLight.directSpecular *= mix(1.0, rtAo, 0.6);`
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
          ${
            kind === "skin"
              ? `// light scattering under the skin: a soft red band where light turns to shadow
          float rtNL = dot(normal, normalize(uKeyView));
          float rtS = smoothstep(-0.35, 0.05, rtNL) * (1.0 - smoothstep(0.05, 0.5, rtNL));
          totalEmissiveRadiance += uBlush * rtS * 0.07 * vAo;`
              : ""
          }
          totalEmissiveRadiance += uHotColor * (rtGlow * rtGlow * 0.3 + rtRing * 0.7 + rtEdge * 1.6);`
        );
    };
    mat.customProgramCacheKey = () => `riptide-${kind}`;
    return mat;
  }

  /* ── Geometry ─────────────────────────────────────────────── */
  buildFigure(buf) {
    const { geo, nBody, nEyes, idx, pos } = decode(buf);

    // eye centres (object space) for the iris
    const sum = { L: [0, 0, 0, 0], R: [0, 0, 0, 0] };
    for (let i = nBody * 3; i < (nBody + nEyes) * 3; i++) {
      const v = idx[i];
      const s = pos[v * 3] > 0 ? sum.L : sum.R;
      s[0] += pos[v * 3];
      s[1] += pos[v * 3 + 1];
      s[2] += pos[v * 3 + 2];
      s[3] += 1;
    }
    for (const [k, s] of Object.entries(sum)) if (s[3]) this.uniforms[`uEye${k}`].value.set(s[0] / s[3], s[1] / s[3], s[2] / s[3]);

    const c = this.colors;
    this.skin = this.patch(
      new THREE.MeshPhysicalMaterial({
        color: c.skin,
        roughness: 0.56,
        metalness: 0,
        specularIntensity: 0.55,
        sheen: 0.22,
        sheenColor: c.sheen,
        sheenRoughness: 0.55,
        clearcoat: 0.06,
        clearcoatRoughness: 0.45,
        envMapIntensity: 0.13,
      }),
      "skin"
    );
    this.eye = this.patch(
      new THREE.MeshPhysicalMaterial({
        // sclera: off-white, a little shadowed so the eyes don't stare
        color: c.fg.clone().lerp(c.skin, 0.35).multiplyScalar(0.8),
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        envMapIntensity: 0.6,
      }),
      "eye"
    );

    const mesh = new THREE.Mesh(geo, [this.skin, this.eye]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.group.add(mesh);
    this.meshes.push(mesh);
  }

  buildFloor() {
    const coral = this.colors.coral;
    const fg = this.colors.fg;
    const ringA = new THREE.Mesh(
      new THREE.RingGeometry(0.78, 0.795, 96),
      new THREE.MeshBasicMaterial({ color: coral, transparent: true, opacity: 0.55, side: THREE.DoubleSide, toneMapped: false })
    );
    const ringB = new THREE.Mesh(
      new THREE.RingGeometry(1.25, 1.256, 96),
      new THREE.MeshBasicMaterial({ color: fg, transparent: true, opacity: 0.14, side: THREE.DoubleSide, toneMapped: false })
    );
    // soft contact shadow
    const cv = document.createElement("canvas");
    cv.width = cv.height = 128;
    const g = cv.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(0,0,0,0.7)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.75, 48),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, toneMapped: false })
    );
    for (const m of [ringA, ringB, shadow]) {
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.002;
      this.scene.add(m);
    }
    this.floor = [ringA, ringB, shadow];
  }

  /* ── Interaction ──────────────────────────────────────────── */
  bind() {
    let down = null;
    let lastX = 0;
    this.onDown = (e) => {
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
      lastX = e.clientX;
      this.canvas.setPointerCapture(e.pointerId);
    };
    this.onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      if (Math.abs(e.clientX - down.x) > 4) {
        this.targetYaw += dx * 0.011;
        this.sway = 0;
      }
    };
    this.onUp = (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      if (moved < 6) this.tap(e);
      down = null;
    };
    this.canvas.addEventListener("pointerdown", this.onDown);
    this.canvas.addEventListener("pointermove", this.onMove);
    this.canvas.addEventListener("pointerup", this.onUp);
    this.canvas.addEventListener("pointercancel", this.onUp);

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.wrap);
    this.io = new IntersectionObserver(([en]) => (this.visible = en.isIntersecting));
    this.io.observe(this.wrap);
  }

  tap(e) {
    if (!this.loaded) return;
    const r = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hit = this.raycaster.intersectObjects(this.meshes, false)[0];
    if (!hit) return;
    const local = this.group.worldToLocal(hit.point.clone());
    let best = null;
    let bestD = 0.75;
    for (const reg of this.regions) {
      const d = local.distanceTo(V(...reg.pos));
      if (d < bestD) {
        bestD = d;
        best = reg.id;
      }
    }
    if (best) this.onTap(best);
  }

  select(id) {
    const reg = this.regions.find((r) => r.id === id) || null;
    this.selected = reg;
    const d = this.reduced ? 0 : 1.1;
    this.sway = 0;
    if (reg) {
      // turn the shortest way round to face the area
      const two = Math.PI * 2;
      let delta = (((reg.facing - this.targetYaw) % two) + two) % two;
      if (delta > Math.PI) delta -= two;
      gsap.to(this, { targetYaw: this.targetYaw + delta, duration: d, ease: "power3.inOut" });
      gsap.to(this.view, {
        dist: 7.4,
        y: gsap.utils.clamp(1.1, 2.7, reg.pos[1]),
        duration: d,
        ease: "power3.inOut",
      });
      const swap = () => {
        this.hotLocal.set(...reg.pos);
        gsap.to(this.uniforms.uHotAmt, { value: 1, duration: d * 0.8, ease: "power2.out" });
      };
      if (this.uniforms.uHotAmt.value > 0.01 && d) {
        gsap.to(this.uniforms.uHotAmt, { value: 0, duration: 0.25, ease: "power2.in", onComplete: swap });
      } else swap();
    } else {
      gsap.to(this.view, { dist: 9.4, y: 1.78, duration: d, ease: "power3.inOut" });
      gsap.to(this.uniforms.uHotAmt, { value: 0, duration: d * 0.5 });
    }
  }

  /* ── Frame ────────────────────────────────────────────────── */
  resize() {
    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;
    if (!w || !h) return;
    this.w = w;
    this.h = h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep the whole figure in frame on narrow screens
    this.fit = w / h < 0.62 ? 1.18 : 1;
    this.camera.updateProjectionMatrix();
  }

  loop() {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!this.visible) return;
    if (!this.introStarted && this.loaded) {
      this.introStarted = true;
      gsap.to(this.uniforms.uIntro, { value: 3.9, duration: 2.4, ease: "power2.inOut", delay: 0.15 });
    }

    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;
    if (!this.reduced) this.uniforms.uTime.value = t;

    this.yaw += (this.targetYaw - this.yaw) * (1 - Math.pow(0.0015, dt));
    const idle = this.reduced ? 0 : Math.sin(t * 0.45) * 0.38 * this.sway;
    const yaw = this.yaw + idle;
    this.group.rotation.y = yaw;

    const dist = this.view.dist * this.fit;
    this.camera.position.set(0, this.view.y + 0.15, dist);
    this.camera.lookAt(0, this.view.y, 0);
    this.camera.updateMatrixWorld();

    // key light direction in view space, for the skin's scatter band
    this.keyDir.copy(this.key.position).sub(this.key.target.position).normalize().transformDirection(this.camera.matrixWorldInverse);
    this.uniforms.uKeyView.value.copy(this.keyDir);

    this.group.updateMatrixWorld();
    this.uniforms.uHot.value.copy(this.hotLocal).applyMatrix4(this.group.matrixWorld);

    this.renderer.render(this.scene, this.camera);
    this.placeMarkers(yaw);
  }

  placeMarkers(yaw) {
    const introDone = this.uniforms.uIntro.value > 3.6;
    this.regions.forEach((reg, i) => {
      const el = this.markers[i];
      if (!el) return;
      this.tmp.set(...reg.pos).applyMatrix4(this.group.matrixWorld).project(this.camera);
      const x = (this.tmp.x * 0.5 + 0.5) * this.w;
      const y = (-this.tmp.y * 0.5 + 0.5) * this.h;
      const facing = Math.cos(yaw - reg.facing);
      const inFrame = y > 12 && y < this.h - 30;
      const front = facing > -0.05 && introDone && inFrame;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = front ? (this.selected && this.selected.id !== reg.id ? "0.45" : "1") : "0";
      el.style.pointerEvents = front ? "auto" : "none";
      el.tabIndex = front ? 0 : -1;
    });
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    gsap.killTweensOf([this, this.view, this.uniforms.uHotAmt, this.uniforms.uIntro]);
    this.canvas.removeEventListener("pointerdown", this.onDown);
    this.canvas.removeEventListener("pointermove", this.onMove);
    this.canvas.removeEventListener("pointerup", this.onUp);
    this.canvas.removeEventListener("pointercancel", this.onUp);
    this.ro.disconnect();
    this.io.disconnect();
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) {
        if (m.map) m.map.dispose();
        m.dispose();
      }
    });
    if (this.key) this.key.shadow.map?.dispose();
    this.envTex.dispose();
    this.renderer.dispose();
  }
}
