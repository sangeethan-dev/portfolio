"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, MQ } from "@/lib/gsap";
import { spotlight } from "@/content/site";
import styles from "./Spotlight.module.css";

/*
 * Magnetic marquee — a strip of practice photos that follows the pointer up
 * and down and shoulders the copy out of its way, leaving a wake in the lines
 * it passes. Sideways pointer motion steers the marquee's speed and direction;
 * the strip banks with vertical speed and skews with horizontal speed.
 *
 * Touch / idle: an autopilot sweeps the strip so the effect still reads.
 * Reduced motion: everything rests in place (strip above, copy below).
 *
 * After Sangee Inspirations' "Magnetic Marquee" (itself after Codegrid).
 */
const CFG = {
  baseSpeed: 60, // px/s marquee drift at rest
  steerGain: 8, // horizontal pointer velocity → speed
  followEase: 0.07,
  barGap: 18, // px — space kept between the strip and the label bars
  riseRate: 0.85,
  risenTopGap: 150,
  liftHeadStart: 120,
  wakeStrength: 2.4,
  wakeReach: 120,
  lineEase: 0.09,
  bank: 0.22, // deg per px/frame of vertical velocity
  idleAfter: 3000,
};

const clamp = (min, max, v) => Math.min(max, Math.max(min, v));

export default function Spotlight() {
  const rootRef = useRef(null);
  const stripRef = useRef(null);
  const trackRef = useRef(null);
  const hintRef = useRef(null);
  const barTopRef = useRef(null);
  const barBottomRef = useRef(null);

  useEffect(() => {
    const section = rootRef.current;
    const strip = stripRef.current;
    const track = trackRef.current;
    const hint = hintRef.current;
    const reduced = window.matchMedia(MQ.reduced).matches;
    const sourceItems = Array.from(track.querySelectorAll("[data-frame]"));
    const targets = Array.from(section.querySelectorAll("[data-lines]"));

    let splits = [];
    let lines = [];
    let setWidth = 0;
    let sectionH = 0;
    let stripBaseTop = 0;
    let stripH = 0;
    let contentTop = 0;
    let topLimit = 0; // strip-centre limits (section coords)
    let bottomLimit = 0;

    let targetY = 0;
    let currentY = 0;
    let prevY = 0;
    let pointerMoved = false;
    let lastInput = -Infinity;
    let lastX = null;
    let pointerVX = 0;
    let direction = -1;
    let x = 0;
    let speed = -CFG.baseSpeed;
    let running = false;
    let disposed = false;

    const restOffset = () => topLimit - stripBaseTop - stripH / 2;
    const lowestOffset = () => bottomLimit - stripBaseTop - stripH / 2;

    /* ── layout: split lines, clone frames, measure ─────────────── */
    function split() {
      splits.forEach((s) => s.revert());
      splits = targets.map((el) => SplitText.create(el, { type: "lines", linesClass: styles.line }));
      lines = splits.flatMap((s) => s.lines.map((el) => ({ el, restY: 0, y: 0 })));
    }

    function buildTrack() {
      track.querySelectorAll("[data-clone]").forEach((n) => n.remove());
      setWidth = sourceItems.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0);
      const copies = Math.ceil((window.innerWidth * 1.2) / Math.max(setWidth, 1)) + 1;
      for (let c = 0; c < copies; c++) {
        sourceItems.forEach((el) => {
          const clone = el.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.setAttribute("data-clone", "");
          clone.removeAttribute("data-frame");
          track.appendChild(clone);
        });
      }
    }

    function measure() {
      sectionH = section.getBoundingClientRect().height;
      stripBaseTop = strip.offsetTop;
      stripH = strip.offsetHeight;
      const sTop = section.getBoundingClientRect().top;
      // the strip travels between the two label bars
      topLimit = barTopRef.current.getBoundingClientRect().bottom - sTop + CFG.barGap + stripH / 2;
      bottomLimit = barBottomRef.current.getBoundingClientRect().top - sTop - CFG.barGap - stripH / 2;
      let top = Infinity;
      lines.forEach((line) => {
        const r = line.el.getBoundingClientRect();
        const y = r.top - sTop - line.y; // remove any current offset
        line.restY = y + r.height / 2;
        top = Math.min(top, y);
      });
      contentTop = Number.isFinite(top) ? top : sectionH * 0.4;
      if (!pointerMoved) targetY = currentY = prevY = restOffset();
    }

    function layout() {
      lines.forEach((l) => gsap.set(l.el, { clearProps: "transform" }));
      split();
      buildTrack();
      measure();
      if (reduced) gsap.set(strip, { y: currentY });
    }

    /* ── input ─────────────────────────────────────────────────── */
    function setFromClientY(clientY) {
      const cy = clientY - section.getBoundingClientRect().top;
      targetY = clamp(restOffset(), lowestOffset(), cy - stripBaseTop - stripH / 2);
    }

    function onMove(e) {
      if (e.pointerType === "touch") return; // let touch scroll the page
      pointerMoved = true;
      lastInput = performance.now();
      gsap.to(hint, { autoAlpha: 0, duration: 0.4, overwrite: true });
      setFromClientY(e.clientY);
      if (lastX !== null) pointerVX += e.clientX - lastX;
      lastX = e.clientX;
    }
    const onLeave = () => (lastX = null);

    /* ── frame loop ────────────────────────────────────────────── */
    const setTrack = (tx, skew) => (track.style.transform = `translate3d(${tx}px,0,0) skewX(${skew}deg)`);

    function tick(time, deltaMs) {
      const dt = Math.min(deltaMs / 1000, 0.05);
      const f = dt * 60;
      const now = performance.now();

      if (now - lastInput > CFG.idleAfter && sectionH) {
        const s = (Math.sin(now * 0.00055) + 1) / 2;
        targetY = restOffset() + (lowestOffset() - restOffset()) * s * s;
        if (pointerMoved) gsap.to(hint, { autoAlpha: 1, duration: 0.6, overwrite: true });
      }

      // horizontal: steer the marquee
      const vx = pointerVX;
      pointerVX = 0;
      if (Math.abs(vx) > 2) direction = vx > 0 ? 1 : -1;
      const base = CFG.baseSpeed * direction;
      speed += (base + vx * CFG.steerGain - speed) * 0.06 * f;
      x += speed * dt;
      if (setWidth > 0) x = (((x % setWidth) + setWidth) % setWidth) - setWidth;
      setTrack(x, clamp(-8, 8, (speed - base) * -0.012));

      // vertical: strip follows the pointer, banking with speed
      currentY += (targetY - currentY) * CFG.followEase * f;
      const vy = (currentY - prevY) / Math.max(f, 0.001);
      prevY = currentY;
      strip.style.transform = `translate3d(0,${currentY}px,0) rotate(${clamp(-6, 6, vy * CFG.bank)}deg)`;
      strip.style.setProperty("--img-scale", (1 + Math.min(Math.abs(vy), 20) * 0.006).toFixed(3));

      // text: lift above the strip + a wake proportional to its velocity
      const stripCenter = stripBaseTop + currentY + stripH / 2;
      const descent = Math.max(0, stripCenter - topLimit);
      const rise = -Math.min(descent * CFG.riseRate, Math.max(0, contentTop - CFG.risenTopGap));
      for (const line of lines) {
        const gap = line.restY - stripCenter;
        const reached = stripCenter + CFG.liftHeadStart >= line.restY;
        const wake = Math.exp(-(gap * gap) / (2 * CFG.wakeReach * CFG.wakeReach));
        const t = (reached ? rise : 0) + vy * wake * CFG.wakeStrength;
        line.y += (t - line.y) * CFG.lineEase * f;
        line.el.style.transform = `translate3d(0,${line.y.toFixed(2)}px,0)`;
      }
    }

    function start() {
      if (running || reduced) return;
      running = true;
      gsap.ticker.add(tick);
    }
    function stop() {
      running = false;
      gsap.ticker.remove(tick);
    }

    /* ── boot ──────────────────────────────────────────────────── */
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    let rt = 0;
    let lastW = window.innerWidth;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (window.innerWidth === lastW && pointerMoved) return; // mobile URL bar
        lastW = window.innerWidth;
        layout();
      }, 150);
    }

    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
      if (disposed) return;
      layout();
      io.observe(section);
    });

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      clearTimeout(rt);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      track.querySelectorAll("[data-clone]").forEach((n) => n.remove());
      splits.forEach((s) => s.revert());
      gsap.set([strip, track], { clearProps: "transform" });
    };
  }, []);

  return (
    <section
      id="practices"
      ref={rootRef}
      className={styles.section}
      data-theme-section="live"
      data-cursor="Steer"
    >
      <div ref={barTopRef} className={`container ${styles.bar} ${styles.barTop}`}>
        <span className="label">Fig. 03 — Who I build for</span>
        <span className="label">Practices · Studios · Clinics</span>
      </div>

      <div ref={stripRef} className={styles.strip}>
        <div ref={trackRef} className={styles.track}>
          {spotlight.frames.map((f, i) => (
            <figure key={f.src} className={styles.item} data-frame>
              <Image src={f.src} alt={f.alt} width={720} height={450} sizes="(max-width: 767px) 200px, 300px" />
              <figcaption>
                {f.caption} — {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title} data-lines>
          {spotlight.title}
        </h2>
        <p className={styles.sub} data-lines>
          {spotlight.sub}
        </p>
        <div className={styles.copy}>
          {spotlight.copy.map((p) => (
            <p key={p} data-lines>
              {p}
            </p>
          ))}
        </div>
      </div>

      <div ref={barBottomRef} className={`container ${styles.bar} ${styles.barBottom}`}>
        <span className="label">Photos · Unsplash</span>
        <span ref={hintRef} className={`label ${styles.hint}`}>
          Move up and down to pull the strip · sideways to steer it
        </span>
        <span className="label">Index 01—{String(spotlight.frames.length).padStart(2, "0")}</span>
      </div>
    </section>
  );
}
