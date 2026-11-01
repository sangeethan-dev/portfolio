"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { agency } from "@/content/site";
import styles from "./Agencies.module.css";

/*
 * A buyer's checklist: the questions to put to any white-label developer,
 * each answered as it scrolls in, with its box ticking itself off.
 */
export default function AgencyQuestions() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const { title, intro, items } = agency.questions;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const triggers = gsap.utils.toArray("[data-q]", rootRef.current).map((row) => {
          gsap.set(row.querySelector("[data-q-tick]"), { drawSVG: "0%" });
          const tl = gsap.timeline({ paused: true });
          tl.from(row.querySelector("[data-q-rule]"), { scaleX: 0, duration: 1, ease: "expo.inOut" })
            .from(row.querySelectorAll("[data-q-cell]"), { y: 30, autoAlpha: 0, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 0.2)
            .to(row.querySelector("[data-q-tick]"), { drawSVG: "100%", duration: 0.45, ease: "power2.out" }, 0.75);
          return ScrollTrigger.create({ trigger: row, start: "top 85%", once: true, onEnter: () => tl.play() });
        });
        return () => triggers.forEach((t) => t.kill());
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="questions" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 10 — Questions</span>
        <h2 ref={titleRef} className={styles.title}>
          {title}
        </h2>
        <p className={styles.intro}>{intro}</p>
      </div>

      <ol className={`container ${styles.rows}`}>
        {items.map((q) => (
          <li key={q.q} className={styles.qRow} data-q>
            <i className={styles.rule} data-q-rule aria-hidden="true" />
            <span className={styles.qBox} data-q-cell aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path data-q-tick d="M2.5 8.5 L6.5 12 L13.5 4" />
              </svg>
            </span>
            <h3 className={styles.rowTitle} data-q-cell>
              {q.q}
            </h3>
            <p className={styles.rowDesc} data-q-cell>
              {q.a}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
