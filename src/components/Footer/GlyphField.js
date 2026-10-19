"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { onThemeChange } from "@/lib/gsap/theme";
import styles from "./GlyphField.module.css";

/*
 * ASCII Glyph Field — ported from my experiment of the same name
 * (sangee-inspirations/showcases/ascii-glyph-field).
 *
 * A word drawn as thousands of scrambling glyphs. They scatter from the
 * cursor (harder the faster it moves), heat up toward the accent as they
 * move, and spring home. A click sends a shockwave through them. With no
 * input it runs on autopilot.
 *
 * Differences from the original: one word (no morphing), no cell grid or
 * halo — the glyphs sit straight on the footer's background — sized to its
 * container, colours read from the theme tokens (re-read when the theme
 * flips), fonts from next/font, driven by the GSAP ticker and only while on
 * screen.
 */
const RAMP = ".:-=+*#%@08";
const PUSH_RADIUS = 7; // cells
const PUSH_BASE = 0.5;
const PUSH_SPEED_GAIN = 0.13;
const SPRING = 0.045;
const DAMPING = 0.8;
const SCRAMBLE_RATE = 0.05;
const IDLE_AFTER = 2600; // ms
const HEAT_LEVELS = 6;
const ALPHA_LEVELS = 4;

/* "#d8d8d8" / "rgb(…)" / anything canvas understands → [r, g, b] */
function toRgb(color) {
  const c = document.createElement("canvas").getContext("2d");
  c.fillStyle = "#000";
  c.fillStyle = color;
  const v = c.fillStyle;
  if (v.startsWith("#")) return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16));
  return v.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
}

export default function GlyphField({ word, label }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia(MQ.reduced).matches;
    const rootStyle = getComputedStyle(document.documentElement);
    const displayFont = rootStyle.getPropertyValue("--font-familjen").trim() || "sans-serif";
    const monoFont = rootStyle.getPropertyValue("--font-jetbrains-mono").trim() || "monospace";

    // ── colours (from the live theme tokens) ──
    let palette = [];
    let pulseRgb = [0, 0, 0];
    function readColors() {
      const cs = getComputedStyle(document.documentElement);
      const fg = toRgb(cs.getPropertyValue("--fg").trim());
      const hot = toRgb(cs.getPropertyValue("--accent").trim());
      pulseRgb = hot;
      palette = [];
      for (let h = 0; h < HEAT_LEVELS; h++) {
        const t = h / (HEAT_LEVELS - 1);
        const rgb = fg.map((v, k) => Math.round(v + (hot[k] - v) * t));
        for (let a = 0; a < ALPHA_LEVELS; a++) {
          palette.push(`rgba(${rgb.join(",")},${((a + 1) / ALPHA_LEVELS).toFixed(2)})`);
        }
      }
    }
    const buckets = Array.from({ length: HEAT_LEVELS * ALPHA_LEVELS }, () => []);

    // ── layout + cell store ──
    let W = 0, H = 0, dpr = 1;
    let CELL = 8, STEP = 10;
    let cols = 0, rows = 0, N = 0;
    let on, life, delay, ox, oy, vx, vy, heat, baseChar, curChar;
    let active = new Int32Array(0);
    let activeCount = 0;

    const pointer = { x: -999, y: -999, px: -999, py: -999, speed: 0, inside: false };
    let lastInput = -Infinity;
    const pulses = [];

    function setup() {
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      if (!W || !H) {
        N = 0;
        return;
      }
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const small = W < 768;
      CELL = small ? 4 : 7;
      STEP = CELL + (small ? 1 : 2);
      cols = Math.ceil(W / STEP);
      rows = Math.ceil(H / STEP);
      N = cols * rows;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      readColors();

      on = new Uint8Array(N);
      life = new Float32Array(N);
      delay = new Float32Array(N);
      ox = new Float32Array(N);
      oy = new Float32Array(N);
      vx = new Float32Array(N);
      vy = new Float32Array(N);
      heat = new Float32Array(N);
      baseChar = new Uint8Array(N);
      curChar = new Uint8Array(N);
      active = new Int32Array(N);
      activeCount = 0;
      loadWord();
    }

    // render the word into a cols × rows canvas and read luminance per cell
    function sampleWord() {
      const c = document.createElement("canvas");
      c.width = cols;
      c.height = rows;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.fillStyle = "#000";
      g.fillRect(0, 0, cols, rows);

      let size = rows * 0.9;
      g.font = `700 ${size}px ${displayFont}`;
      const measured = g.measureText(word).width;
      const maxW = cols * 0.97;
      if (measured > maxW) size *= maxW / measured;
      g.font = `700 ${size}px ${displayFont}`;
      g.textAlign = "center";
      g.textBaseline = "middle";

      const grad = g.createLinearGradient(0, rows / 2 - size / 2, 0, rows / 2 + size / 2);
      grad.addColorStop(0, "#fff");
      grad.addColorStop(1, "#8a8a8a");
      g.fillStyle = grad;
      g.fillText(word, cols / 2, rows / 2 + size * 0.04);

      const { data } = g.getImageData(0, 0, cols, rows);
      const lum = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const p = i * 4;
        lum[i] = (data[p] * 0.299 + data[p + 1] * 0.587 + data[p + 2] * 0.114) / 255;
      }
      return lum;
    }

    function loadWord() {
      const lum = sampleWord();
      activeCount = 0;
      for (let i = 0; i < N; i++) {
        const lit = lum[i] > 0.3;
        if (lit) baseChar[i] = Math.min(RAMP.length - 1, Math.floor(lum[i] * RAMP.length));
        on[i] = lit ? 1 : 0;
        life[i] = reduced ? on[i] : 0;
        delay[i] = reduced ? 0 : ((i % cols) / cols) * 40 + Math.random() * 12;
        curChar[i] = baseChar[i];
        if (on[i]) active[activeCount++] = i;
      }
    }

    // ── input ──
    function setPointer(e) {
      const r = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / STEP;
      pointer.y = (e.clientY - r.top) / STEP;
      pointer.inside = true;
      lastInput = performance.now();
    }
    function onMove(e) {
      setPointer(e);
    }
    function onDown(e) {
      setPointer(e);
      firePulse(pointer.x, pointer.y);
    }
    function onLeave() {
      pointer.inside = false;
    }
    function firePulse(x, y) {
      if (!reduced) pulses.push({ x, y, r: 0, strength: 1 });
    }

    function autopilot(t) {
      const s = t * 0.00045;
      pointer.x = cols / 2 + Math.sin(s * 1.7) * cols * 0.34;
      pointer.y = rows / 2 + Math.sin(s * 2.9 + 1.2) * rows * 0.25;
    }

    // ── simulation ──
    function step(time, deltaMs) {
      if (!N) return;
      const now = performance.now();
      const dt = Math.min(deltaMs / 16.667, 3);

      const idle = now - lastInput > IDLE_AFTER;
      if (idle) autopilot(now);
      const tracking = pointer.inside || idle;

      const dx = pointer.x - pointer.px;
      const dy = pointer.y - pointer.py;
      const rawSpeed = pointer.px < -900 ? 0 : Math.hypot(dx, dy) / dt;
      pointer.speed += (Math.min(rawSpeed, 12) - pointer.speed) * 0.35;
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      for (const p of pulses) {
        p.r += 1.6 * dt;
        p.strength *= Math.pow(0.975, dt);
      }
      while (pulses.length && pulses[0].strength < 0.05) pulses.shift();

      const force = PUSH_BASE + pointer.speed * PUSH_SPEED_GAIN;
      const r2 = PUSH_RADIUS * PUSH_RADIUS;
      const springK = SPRING * dt;
      const damp = Math.pow(DAMPING, dt);

      let write = 0;
      for (let a = 0; a < activeCount; a++) {
        const i = active[a];

        if (delay[i] > 0) {
          delay[i] -= dt;
        } else {
          const target = on[i];
          life[i] += (target - life[i]) * 0.12 * dt;
          if (!target && life[i] < 0.002) life[i] = 0;
        }
        if (!on[i] && life[i] === 0 && delay[i] <= 0) {
          ox[i] = oy[i] = vx[i] = vy[i] = heat[i] = 0;
          continue;
        }
        active[write++] = i;

        const c = i % cols, r = (i / cols) | 0;
        const px = c + ox[i], py = r + oy[i];

        if (tracking) {
          const ddx = px - pointer.x, ddy = py - pointer.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < r2 && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const f = (1 - d / PUSH_RADIUS) ** 2 * force * dt;
            vx[i] += (ddx / d) * f;
            vy[i] += (ddy / d) * f;
          }
        }

        for (let k = 0; k < pulses.length; k++) {
          const p = pulses[k];
          const ddx = px - p.x, ddy = py - p.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy) || 0.001;
          const band = Math.abs(d - p.r);
          if (band < 2.5) {
            const f = (1 - band / 2.5) * p.strength * 0.9 * dt;
            vx[i] += (ddx / d) * f;
            vy[i] += (ddy / d) * f;
          }
        }

        vx[i] = (vx[i] - ox[i] * springK) * damp;
        vy[i] = (vy[i] - oy[i] * springK) * damp;
        ox[i] += vx[i] * dt;
        oy[i] += vy[i] * dt;

        const motion = Math.hypot(vx[i], vy[i]) * 1.6 + Math.hypot(ox[i], oy[i]) * 0.18;
        heat[i] += (Math.min(motion, 1) - heat[i]) * 0.2;

        const transitioning = life[i] < 0.98 && delay[i] <= 0;
        if (heat[i] > 0.25 || transitioning || Math.random() < SCRAMBLE_RATE) {
          curChar[i] = (Math.random() * RAMP.length) | 0;
        } else if (Math.random() < 0.02) {
          curChar[i] = baseChar[i];
        }
      }
      activeCount = write;

      render();
    }

    // ── render ──
    function render() {
      ctx.clearRect(0, 0, W, H);

      for (const p of pulses) {
        ctx.strokeStyle = `rgba(${pulseRgb.join(",")},${(p.strength * 0.35).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x * STEP, p.y * STEP, p.r * STEP, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const b of buckets) b.length = 0;
      for (let a = 0; a < activeCount; a++) {
        const i = active[a];
        const l = life[i];
        if (l < 0.02) continue;
        const h = Math.min(HEAT_LEVELS - 1, (heat[i] * HEAT_LEVELS) | 0);
        const al = Math.min(ALPHA_LEVELS - 1, (l * ALPHA_LEVELS) | 0);
        buckets[h * ALPHA_LEVELS + al].push(i);
      }

      ctx.font = `500 ${CELL + 3}px ${monoFont}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const half = CELL / 2;
      for (let b = 0; b < buckets.length; b++) {
        const list = buckets[b];
        if (!list.length) continue;
        ctx.fillStyle = palette[b];
        for (let k = 0; k < list.length; k++) {
          const i = list[k];
          const c = i % cols, r = (i / cols) | 0;
          ctx.fillText(RAMP[curChar[i]], (c + ox[i]) * STEP + half, (r + oy[i]) * STEP + half + 0.5);
        }
      }
    }

    // ── boot: only simulate while the field is on screen ──
    let running = false;
    function play() {
      if (running || reduced) return;
      running = true;
      gsap.ticker.add(step);
    }
    function pause() {
      if (!running) return;
      running = false;
      gsap.ticker.remove(step);
    }

    let disposed = false;
    let io = null;
    const ro = new ResizeObserver(() => {
      if (!N) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setup();
        if (reduced) render();
      }, 150);
    });
    let resizeTimer = 0;

    // the theme tween takes ~0.9s; re-read the colours once it settles
    let themeTimer = 0;
    const offTheme = onThemeChange(() => {
      clearTimeout(themeTimer);
      themeTimer = setTimeout(() => {
        readColors();
        if (reduced && N) render();
      }, 950);
    });

    const fontFamily = displayFont.split(",")[0].replace(/['"]/g, "").trim();
    Promise.race([
      document.fonts.load(`700 64px "${fontFamily}"`),
      new Promise((r) => setTimeout(r, 1500)),
    ]).finally(() => {
      if (disposed) return;
      setup();
      if (reduced) render();
      io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()), { rootMargin: "100px" });
      io.observe(wrap);
      ro.observe(wrap);
    });

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      pause();
      if (io) io.disconnect();
      ro.disconnect();
      offTheme();
      clearTimeout(resizeTimer);
      clearTimeout(themeTimer);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [word]);

  return (
    <div className={styles.field}>
      <div ref={wrapRef} className={styles.stage} data-cursor="Pulse">
        <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label={label} />
      </div>
    </div>
  );
}
