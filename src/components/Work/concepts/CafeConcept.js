"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsap";
import styles from "./CafeConcept.module.css";

/* fill = coffee level (0–1), foam = foam depth in svg units, tone = css var */
const MENU = [
  { name: "Flat white", price: "5.5", fill: 0.72, foam: 10, tone: "--cafe-latte" },
  { name: "Long black", price: "5.0", fill: 0.8, foam: 0, tone: "--cafe-espresso" },
  { name: "Magic", price: "5.8", fill: 0.5, foam: 8, tone: "--cafe-latte" },
  { name: "Chai latte", price: "6.0", fill: 0.78, foam: 14, tone: "--cafe-chai" },
  { name: "Batch brew", price: "4.5", fill: 0.85, foam: 0, tone: "--cafe-espresso" },
];

const CUP_BOTTOM = 182;
const CUP_DEPTH = 86;

export default function CafeConcept() {
  const rootRef = useRef(null);
  const coffeeRef = useRef(null);
  const foamRef = useRef(null);
  const steamRef = useRef(null);
  const sweepRefs = useRef([]);
  const [active, setActive] = useState(0);

  /* Steam loop — only while visible */
  useEffect(() => {
    if (window.matchMedia(MQ.reduced).matches) return;
    const paths = steamRef.current.querySelectorAll("path");
    const tl = gsap.timeline({ repeat: -1, paused: true });
    paths.forEach((p, i) => {
      tl.fromTo(
        p,
        { drawSVG: "0% 0%", y: 10, autoAlpha: 0 },
        {
          keyframes: [
            { drawSVG: "0% 60%", autoAlpha: 0.9, y: 0, duration: 1.1, ease: "sine.out" },
            { drawSVG: "60% 100%", autoAlpha: 0, y: -16, duration: 1.1, ease: "sine.in" },
          ],
        },
        i * 0.6
      );
    });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.play() : tl.pause()));
    io.observe(rootRef.current);
    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  /* Pour the selected drink */
  useEffect(() => {
    const item = MENU[active];
    const color = getComputedStyle(document.documentElement).getPropertyValue(item.tone).trim();
    const top = CUP_BOTTOM - item.fill * CUP_DEPTH;
    const reduced = window.matchMedia(MQ.reduced).matches;
    const d = reduced ? 0 : 0.9;
    gsap.to(coffeeRef.current, { attr: { y: top }, fill: color, duration: d, ease: "elastic.out(1, 0.6)" });
    gsap.to(foamRef.current, {
      attr: { y: top - item.foam, height: item.foam + 2 },
      duration: d,
      ease: "elastic.out(1, 0.6)",
    });

    sweepRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, { scaleX: i === active ? 1 : 0, duration: reduced ? 0 : 0.45, ease: "expo.out" });
    });
  }, [active]);

  const item = MENU[active];

  return (
    <div ref={rootRef} className={styles.site}>
      <header className={styles.nav}>
        <span className={styles.logo}>Grounds &amp; Co.</span>
        <span className={styles.open}>
          <i /> Open today 6:30–3
        </span>
      </header>

      <div className={styles.main}>
        <div className={styles.left}>
          <p className={styles.h1}>
            Slow coffee,
            <br />
            <em>fast</em> mornings.
          </p>

          <ul className={styles.menu} data-cursor="Pick one">
            {MENU.map((m, i) => (
              <li key={m.name}>
                <button
                  type="button"
                  className={`${styles.item}${i === active ? ` ${styles.itemOn}` : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                >
                  <span ref={(el) => (sweepRefs.current[i] = el)} className={styles.sweep} />
                  <span className={styles.itemName}>{m.name}</span>
                  <span className={styles.dots} />
                  <span className={styles.itemPrice}>${m.price}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.right}>
          <svg className={styles.cup} viewBox="0 0 220 220" aria-hidden="true">
            <defs>
              <clipPath id="cafe-glass">
                <path d="M47 96 L153 96 L144 172 Q142 182 132 182 L68 182 Q58 182 56 172 Z" />
              </clipPath>
            </defs>
            <g ref={steamRef} className={styles.steam}>
              <path d="M78 80 q-12 -14 0 -28 q12 -14 0 -30" />
              <path d="M100 76 q-12 -14 0 -28 q12 -14 0 -30" />
              <path d="M122 80 q-12 -14 0 -28 q12 -14 0 -30" />
            </g>
            <ellipse className={styles.saucer} cx="100" cy="196" rx="88" ry="13" />
            <g clipPath="url(#cafe-glass)">
              <rect ref={coffeeRef} className={styles.coffee} x="40" y="120" width="120" height="100" />
              <rect ref={foamRef} className={styles.foam} x="40" y="110" width="120" height="12" />
            </g>
            <path
              className={styles.glass}
              d="M40 90 L160 90 L150 175 Q148 188 135 188 L65 188 Q52 188 50 175 Z"
            />
            <path className={styles.handle} d="M156 106 q32 0 30 26 q-2 26 -34 24" />
          </svg>

          <p className={styles.caption} aria-live="polite">
            <span>{item.name}</span>
            <span className={styles.capPrice}>${item.price}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
