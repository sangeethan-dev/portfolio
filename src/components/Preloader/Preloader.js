"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { setScrollLocked } from "@/lib/lenis/useLenis";
import { markPreloaderDone } from "@/lib/preloader";
import styles from "./Preloader.module.css";

const SEEN_KEY = "sg-preloaded";

const V_LINES = [10, 22.5, 35, 47.5, 60, 72.5, 85];
const H_LINES = [18, 36, 54, 72, 90];

function readSeen() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}
}

/*
 * ~1.4s intro: the blueprint grid draws itself, a counter compiles to 100,
 * then the sheet splits open. Once per session; click to skip.
 */
export default function Preloader() {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const statusRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const gridRef = useRef(null);
  const metaRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;

    function finish() {
      root.style.display = "none";
      setScrollLocked(false);
      markPreloaderDone();
    }

    if (readSeen() || window.matchMedia(MQ.reduced).matches) {
      finish();
      return;
    }

    setScrollLocked(true);
    window.scrollTo(0, 0);

    const counter = { v: 0 };
    const lines = root.querySelectorAll("line");

    const tl = gsap.timeline({
      onComplete() {
        writeSeen();
        finish();
      },
    });

    tl.from(lines, {
      drawSVG: "0%",
      duration: 0.9,
      ease: "power2.inOut",
      stagger: { each: 0.04, from: "random" },
    })
      .to(
        counter,
        {
          v: 100,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate() {
            countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0
      )
      .to(statusRef.current, {
        duration: 0.35,
        scrambleText: { text: "build complete", chars: "01<>/_", speed: 0.8 },
      }, 0.75)
      .to([gridRef.current, metaRef.current], { autoAlpha: 0, duration: 0.3 }, "+=0.15")
      .to(topRef.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.1")
      .to(bottomRef.current, { yPercent: 100, duration: 0.9, ease: "expo.inOut" }, "<")
      // let the hero start its entrance while the curtain is still opening
      .add(() => markPreloaderDone(), "-=0.55");

    function skip() {
      tl.progress(1);
    }
    root.addEventListener("click", skip);

    return () => {
      root.removeEventListener("click", skip);
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.preloader} data-cursor="Skip" aria-hidden="true">
      <div ref={topRef} className={`${styles.half} ${styles.top}`} />
      <div ref={bottomRef} className={`${styles.half} ${styles.bottom}`} />

      <svg ref={gridRef} className={styles.grid} viewBox="0 0 100 100" preserveAspectRatio="none">
        {V_LINES.map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" />
        ))}
        {H_LINES.map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} />
        ))}
      </svg>

      <div ref={metaRef} className={styles.meta}>
        <span ref={statusRef} className={styles.status}>
          compiling blueprint
        </span>
        <span className={styles.count}>
          <span ref={countRef}>000</span>%
        </span>
      </div>
    </div>
  );
}
