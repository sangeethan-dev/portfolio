"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { agency } from "@/content/site";
import styles from "./Agencies.module.css";

/* Numbered rows: each hairline draws across, then its row rises in */
export default function AgencyWhy() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // A paused timeline played by a plain trigger: a timeline that owns a
        // `once` ScrollTrigger is still waiting for its first tick when the
        // next section's triggers are created, which crashes ScrollTrigger's
        // refresh in GSAP 3.13.
        gsap.utils.toArray("[data-row]", rootRef.current).forEach((row) => {
          const tl = gsap
            .timeline({ paused: true })
            .from(row.querySelector("[data-rule]"), { scaleX: 0, duration: 1, ease: "expo.inOut" })
            .from(row.querySelectorAll("[data-cell]"), { y: 30, autoAlpha: 0, duration: 0.8, ease: "expo.out", stagger: 0.08 }, 0.25);
          ScrollTrigger.create({ trigger: row, start: "top 88%", once: true, onEnter: () => tl.play() });
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.section} data-theme-section="blueprint">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 03 — Why agencies use me</span>
        <h2 ref={titleRef} className={styles.title}>
          An extra developer, without the extra hire.
        </h2>
      </div>

      <ol className={`container ${styles.rows}`}>
        {agency.why.map((w, i) => (
          <li key={w.title} className={styles.row} data-row>
            <i className={styles.rule} data-rule aria-hidden="true" />
            <span className={styles.rowNum} data-cell>
              0{i + 1}
            </span>
            <h3 className={styles.rowTitle} data-cell>
              {w.title}
            </h3>
            <p className={styles.rowDesc} data-cell>
              {w.desc}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
