"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsap";
import styles from "./StoreConcept.module.css";

const COLOURS = [
  { name: "Sand", token: "--store-sand" },
  { name: "Sage", token: "--store-sage" },
  { name: "Clay", token: "--store-clay" },
  { name: "Night", token: "--store-night" },
];

function readToken(token) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

export default function StoreConcept() {
  const rootRef = useRef(null);
  const vaseRef = useRef(null);
  const bodyRef = useRef(null);
  const bagRef = useRef(null);
  const btnRef = useRef(null);
  const btnTextRef = useRef(null);
  const [colour, setColour] = useState(0);
  const [count, setCount] = useState(0);
  const busy = useRef(false);

  /* Re-glaze the vase */
  useEffect(() => {
    const reduced = window.matchMedia(MQ.reduced).matches;
    gsap.to(bodyRef.current, { fill: readToken(COLOURS[colour].token), duration: reduced ? 0 : 0.5, ease: "power2.out" });
    if (!reduced) {
      gsap.fromTo(
        vaseRef.current,
        { rotate: -4, scaleY: 0.94 },
        { rotate: 0, scaleY: 1, duration: 0.9, ease: "elastic.out(1, 0.35)", transformOrigin: "50% 100%" }
      );
    }
  }, [colour]);

  function addToBag() {
    if (busy.current) return;
    const root = rootRef.current;
    const reduced = window.matchMedia(MQ.reduced).matches;
    const done = () => {
      setCount((c) => c + 1);
      if (!reduced) {
        gsap.fromTo(bagRef.current, { scale: 1.35, rotate: -10 }, { scale: 1, rotate: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" });
      }
    };

    gsap.to(btnTextRef.current, {
      duration: 0.3,
      scrambleText: { text: "Added ✓", chars: "·•", speed: 1 },
    });
    gsap.delayedCall(1.6, () =>
      gsap.to(btnTextRef.current, { duration: 0.3, scrambleText: { text: "Add to bag", chars: "·•", speed: 1 } })
    );

    if (reduced) {
      done();
      return;
    }

    busy.current = true;
    const r = root.getBoundingClientRect();
    const from = btnRef.current.getBoundingClientRect();
    const to = bagRef.current.getBoundingClientRect();

    const dot = document.createElement("span");
    dot.className = styles.flyer;
    dot.style.background = readToken(COLOURS[colour].token);
    root.appendChild(dot);

    const sx = from.left - r.left + from.width / 2;
    const sy = from.top - r.top + from.height / 2;
    const ex = to.left - r.left + to.width / 2;
    const ey = to.top - r.top + to.height / 2;

    gsap.set(dot, { x: sx, y: sy, xPercent: -50, yPercent: -50, scale: 0 });
    gsap
      .timeline({
        onComplete() {
          dot.remove();
          busy.current = false;
          done();
        },
      })
      .to(dot, { scale: 1, duration: 0.2, ease: "back.out(3)" })
      // separate eases on x and y draw an arc
      .to(dot, { x: ex, duration: 0.75, ease: "power1.inOut" }, 0.15)
      .to(dot, { y: ey, duration: 0.75, ease: "back.in(1.6)" }, 0.15)
      .to(dot, { scale: 0.3, duration: 0.25, ease: "power2.in" }, 0.65);
  }

  return (
    <div ref={rootRef} className={styles.site}>
      <header className={styles.nav}>
        <span className={styles.logo}>Salt &amp; Fern</span>
        <span className={styles.links}>
          <span>Shop</span>
          <span>Journal</span>
        </span>
        <span ref={bagRef} className={styles.bag} aria-label={`Bag: ${count} items`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span className={styles.count}>
            {count}
          </span>
        </span>
      </header>

      <div className={styles.main}>
        <div className={styles.stage}>
          <span className={styles.plinth} />
          <svg ref={vaseRef} className={styles.vase} viewBox="0 0 120 180" aria-hidden="true">
            <path
              ref={bodyRef}
              className={styles.vaseBody}
              d="M44 8 h32 v14 c0 10 -6 14 -6 24 c0 18 36 34 36 76 c0 34 -22 52 -46 52 c-24 0 -46 -18 -46 -52 c0 -42 36 -58 36 -76 c0 -10 -6 -14 -6 -24 Z"
            />
            <path className={styles.vaseShine} d="M30 98 c-4 14 -4 30 4 44" />
            <ellipse className={styles.vaseRim} cx="60" cy="9" rx="16" ry="3" />
          </svg>
        </div>

        <div className={styles.details}>
          <span className={styles.crumb}>Ceramics / Vases</span>
          <p className={styles.title}>Tidal Vase</p>
          <p className={styles.price}>$68 AUD</p>
          <p className={styles.desc}>Hand-thrown stoneware, glazed in small batches in Byron Bay.</p>

          <div className={styles.colourRow}>
            <span className={styles.colourLabel}>
              Glaze — <b>{COLOURS[colour].name}</b>
            </span>
            <div className={styles.swatches} role="radiogroup" aria-label="Glaze colour">
              {COLOURS.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  role="radio"
                  aria-checked={i === colour}
                  aria-label={c.name}
                  className={`${styles.swatch}${i === colour ? ` ${styles.swatchOn}` : ""}`}
                  style={{ background: `var(${c.token})` }}
                  onClick={() => setColour(i)}
                />
              ))}
            </div>
          </div>

          <button ref={btnRef} type="button" className={styles.add} onClick={addToBag} data-cursor="Add">
            <span ref={btnTextRef}>Add to bag</span>
          </button>
        </div>
      </div>
    </div>
  );
}
