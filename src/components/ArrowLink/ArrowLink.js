"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import styles from "./ArrowLink.module.css";

/*
 * Underlined mono link with a trailing arrow — a port of trionn.com's CTA.
 *
 * Hover in:  the letters slide right one by one (last letter first) until
 *            the word meets the right edge; the right arrow runs off; a left
 *            arrow slides in; the underline retracts to the right, then
 *            redraws from the left.
 * Hover out: everything plays back the other way.
 *
 * Timings are trionn's: 30ms letter step, 300ms base (+30ms per letter),
 * 200ms arrow out, 320ms arrow in, 1000ms / 500ms underline, re-entry at
 * half the letter run. Easing is CSS "ease".
 *
 *   <ArrowLink href="#contact" onClick={…}>Start a project</ArrowLink>
 *   arrow: "right" (default) | "down" | "out" (↗ for external links)
 */
const T = {
  step: 0.03,
  base: 0.3,
  durStep: 0.03,
  insetMin: 8,
  arrowGap: 10,
  run: 28,
  out: 0.2,
  in: 0.32,
  reentry: 0.5,
  ulOut: 1,
  ulIn: 0.5,
};

/* CSS cubic-bezier(.25, .1, .25, 1) — the browser's "ease" */
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (sx(t) - x) / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}
const EASE = bezier(0.25, 0.1, 0.25, 1);

function Arrow() {
  return (
    <svg viewBox="0 0 10 9" className={styles.svg} aria-hidden="true">
      <path d="M0 3.8h8.1L5.2 1 6.2 0 10 3.8v1L6.2 8.6l-1-1 2.9-2.8H0z" />
    </svg>
  );
}

export default function ArrowLink({
  href,
  onClick,
  children,
  arrow = "right",
  className = "",
  target,
  rel,
  type = "button",
  ...rest
}) {
  const rootRef = useRef(null);
  const text = String(children);
  const chars = useMemo(() => [...text], [text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!window.matchMedia(MQ.finePointer).matches) return;
    if (window.matchMedia(MQ.reduced).matches) return;

    const word = root.querySelector("[data-word]");
    const letters = Array.from(root.querySelectorAll("[data-char]"));
    const right = root.querySelector("[data-arrow-right]");
    const left = root.querySelector("[data-arrow-left]");
    const uRight = root.querySelector("[data-u-right]");
    const uLeft = root.querySelector("[data-u-left]");
    const n = letters.length;
    const reentry = Math.max(0.12, ((n - 1) * T.step + (T.base + (n - 1) * T.durStep)) * T.reentry);

    gsap.set(left, { xPercent: -120, opacity: 0 });
    gsap.set(uRight, { scaleX: 1, transformOrigin: "right center" });
    gsap.set(uLeft, { scaleX: 0, transformOrigin: "left center" });

    // how far the word travels to meet the right edge (letter transforms
    // don't move the word's layout box, so this is stable mid-animation)
    function shift() {
      const b = root.getBoundingClientRect();
      const w = word.getBoundingClientRect();
      return Math.max(0, b.right + 1 - w.right);
    }

    function letterRun(toX, reverse) {
      letters.forEach((el, i) => {
        const o = reverse ? n - i - 1 : i;
        gsap.to(el, {
          x: toX,
          duration: T.base + o * T.durStep,
          delay: o * T.step,
          ease: EASE,
          overwrite: true,
        });
      });
    }

    function enter() {
      letterRun(shift(), true);
      gsap.to(right, { x: T.run, opacity: 0, duration: T.out, ease: EASE, overwrite: true });
      gsap.to(left, { x: 0, xPercent: 0, opacity: 1, duration: T.in, delay: reentry, ease: EASE, overwrite: true });
      gsap.to(uRight, { scaleX: 0, duration: T.ulOut, ease: EASE, overwrite: true });
      gsap.to(uLeft, { scaleX: 1, duration: T.ulIn, delay: reentry, ease: EASE, overwrite: true });
    }

    function leave() {
      letterRun(0, false);
      gsap.to(left, { x: -T.run, xPercent: 0, opacity: 0, duration: T.out, ease: EASE, overwrite: true });
      gsap.to(right, { x: 0, opacity: 1, duration: T.in, delay: reentry, ease: EASE, overwrite: true });
      gsap.to(uLeft, { scaleX: 0, duration: T.ulOut, ease: EASE, overwrite: true });
      gsap.to(uRight, { scaleX: 1, duration: T.ulIn, delay: reentry, ease: EASE, overwrite: true });
    }

    // trionn debounces both by 20ms so a quick brush past doesn't fire
    let t = 0;
    const onEnter = () => {
      clearTimeout(t);
      t = setTimeout(enter, 20);
    };
    const onLeave = () => {
      clearTimeout(t);
      t = setTimeout(leave, 20);
    };
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      clearTimeout(t);
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([...letters, right, left, uRight, uLeft]);
    };
  }, [text]);

  const Tag = href ? "a" : "button";
  const tagProps = href ? { href, target, rel } : { type };

  return (
    <Tag
      ref={rootRef}
      className={`${styles.link} ${styles[arrow] || ""} ${className}`}
      onClick={onClick}
      aria-label={rest["aria-label"] || text}
      {...tagProps}
      {...rest}
    >
      <span className={styles.underline} aria-hidden="true">
        <i className={styles.u} data-u-right />
        <i className={styles.u} data-u-left />
      </span>
      <span className={styles.word} data-word aria-hidden="true">
        {chars.map((ch, i) => (
          <span key={i} className={styles.char} data-char>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
      <span className={`${styles.arrow} ${styles.arrowRight}`} aria-hidden="true">
        <span className={styles.sprite} data-arrow-right>
          <Arrow />
        </span>
      </span>
      <span className={`${styles.arrow} ${styles.arrowLeft}`} aria-hidden="true">
        <span className={styles.sprite} data-arrow-left>
          <Arrow />
        </span>
      </span>
    </Tag>
  );
}
