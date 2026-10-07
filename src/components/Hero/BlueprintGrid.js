"use client";

import { useEffect, useRef } from "react";
import { MQ } from "@/lib/gsap";

/*
 * Canvas blueprint grid with spring physics.
 *
 * Every grid intersection is a node on a spring. The pointer pushes nodes
 * away (harder when it moves fast), so the mesh wobbles like jelly and
 * settles back, and lines glow signal-orange around it.
 *
 * With no pointer (touch, idle) the force drifts on a slow Lissajous path
 * so the grid is never dead. Reduced motion: a static grid.
 */
const CELL = 56;        // grid spacing (px)
const RADIUS = 240;     // pointer influence radius (px)
const PUSH = 1.5;       // steady push at the pointer centre
const SPEED_PUSH = 0.035; // extra push per px/frame of pointer speed
const SPRING = 0.07;    // pull back to rest
const DAMPING = 0.8;    // velocity kept per frame (lower = less wobble)

export default function BlueprintGrid({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const host = canvas.parentElement;
    const reduced = window.matchMedia(MQ.reduced).matches;

    const cs = getComputedStyle(document.documentElement);
    const gridRgb = cs.getPropertyValue("--grid-rgb").trim();
    const hotRgb = cs.getPropertyValue("--signal-rgb").trim();

    let W = 0;
    let H = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let t = 0;

    // Node grid (one ring of extra nodes outside the canvas so lines reach the edges)
    let cols = 0;
    let rows = 0;
    let offX = 0;
    let offY = 0;
    let rx, ry, ox, oy, vx, vy; // rest position, offset, velocity

    const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: 0, py: 0, speed: 0, active: false, strength: 0 };

    const idx = (c, r) => r * cols + c;

    function build() {
      offX = ((W % CELL) / 2) - CELL;
      offY = ((H % CELL) / 2) - CELL;
      cols = Math.ceil(W / CELL) + 3;
      rows = Math.ceil(H / CELL) + 3;
      const n = cols * rows;
      rx = new Float32Array(n);
      ry = new Float32Array(n);
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = idx(c, r);
          rx[i] = offX + c * CELL;
          ry[i] = offY + r * CELL;
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = host.clientWidth;
      H = host.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (!pointer.active) {
        pointer.x = pointer.tx = pointer.px = W * 0.62;
        pointer.y = pointer.ty = pointer.py = H * 0.45;
      }
      if (reduced) draw();
    }

    /* ── Physics ─────────────────────────────────────────────────── */
    function step() {
      const force = pointer.strength * (PUSH + Math.min(pointer.speed, 60) * SPEED_PUSH);
      const n = rx.length;

      for (let i = 0; i < n; i++) {
        const x = rx[i] + ox[i];
        const y = ry[i] + oy[i];
        let ax = -SPRING * ox[i];
        let ay = -SPRING * oy[i];

        // pointer push
        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < RADIUS) {
          const f = (1 - d / RADIUS) ** 2 * force;
          ax += (dx / d) * f;
          ay += (dy / d) * f;
        }

        vx[i] = (vx[i] + ax) * DAMPING;
        vy[i] = (vy[i] + ay) * DAMPING;
        ox[i] += vx[i];
        oy[i] += vy[i];
      }
    }

    /* ── Drawing ─────────────────────────────────────────────────── */
    const px = (i) => rx[i] + ox[i];
    const py = (i) => ry[i] + oy[i];

    // Smooth curve through a run of nodes (quadratic through midpoints)
    function trace(getIndex, count) {
      const i0 = getIndex(0);
      ctx.moveTo(px(i0), py(i0));
      for (let k = 1; k < count - 1; k++) {
        const a = getIndex(k);
        const b = getIndex(k + 1);
        ctx.quadraticCurveTo(px(a), py(a), (px(a) + px(b)) / 2, (py(a) + py(b)) / 2);
      }
      const last = getIndex(count - 1);
      ctx.lineTo(px(last), py(last));
    }

    function gridPath() {
      ctx.beginPath();
      for (let r = 0; r < rows; r++) trace((k) => idx(k, r), cols);
      for (let c = 0; c < cols; c++) trace((k) => idx(c, k), rows);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;

      // base grid
      gridPath();
      ctx.strokeStyle = `rgba(${gridRgb}, 0.32)`;
      ctx.stroke();

      if (reduced) return;
      const s = pointer.strength;

      // glow pass — same path, stroked through a radial gradient
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, RADIUS);
      glow.addColorStop(0, `rgba(${hotRgb}, ${(0.95 * s).toFixed(3)})`);
      glow.addColorStop(0.45, `rgba(${hotRgb}, ${(0.35 * s).toFixed(3)})`);
      glow.addColorStop(1, `rgba(${hotRgb}, 0)`);
      ctx.strokeStyle = glow;
      ctx.lineWidth = 1.25;
      ctx.stroke();

      // intersection markers near the pointer: little "+" that grow with proximity
      ctx.strokeStyle = `rgba(${hotRgb}, ${(0.9 * s).toFixed(3)})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      for (let i = 0; i < rx.length; i++) {
        const x = px(i);
        const y = py(i);
        const d = Math.hypot(x - pointer.x, y - pointer.y);
        if (d > RADIUS * 0.6) continue;
        const k = (1 - d / (RADIUS * 0.6)) * 5;
        ctx.moveTo(x - k, y);
        ctx.lineTo(x + k, y);
        ctx.moveTo(x, y - k);
        ctx.lineTo(x, y + k);
      }
      ctx.stroke();
    }

    /* ── Loop ────────────────────────────────────────────────────── */
    function loop() {
      raf = 0;
      if (!visible) return;
      t += 0.006;

      if (!pointer.active) {
        pointer.tx = W * (0.6 + Math.sin(t * 1.3) * 0.22);
        pointer.ty = H * (0.48 + Math.cos(t * 0.9) * 0.24);
      }
      pointer.x += (pointer.tx - pointer.x) * 0.16;
      pointer.y += (pointer.ty - pointer.y) * 0.16;
      const sp = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
      pointer.speed += (sp - pointer.speed) * 0.3;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.strength += ((pointer.active ? 1 : 0.55) - pointer.strength) * 0.05;

      step();
      draw();
      raf = requestAnimationFrame(loop);
    }

    function localPoint(e) {
      const r = host.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    }

    function onMove(e) {
      if (e.pointerType === "touch") return;
      [pointer.tx, pointer.ty] = localPoint(e);
      pointer.active = true;
    }

    function onLeave() {
      pointer.active = false;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    if (reduced) {
      draw();
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(host);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
