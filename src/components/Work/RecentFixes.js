"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { fixes } from "@/content/fixes";
import styles from "./RecentFixes.module.css";

/* Small strip of real fix jobs under the concept projects. Edit
   src/content/fixes.js — the strip disappears when the list is empty. */
export default function RecentFixes() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(rootRef.current.querySelectorAll("[data-fix]"), {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  if (!fixes.length) return null;

  return (
    <div ref={rootRef} className={`container ${styles.strip}`}>
      <div className={styles.head}>
        <span className="label">Recent fixes</span>
        <span className={styles.rule} aria-hidden="true" />
        <span className="label">{String(fixes.length).padStart(2, "0")} jobs</span>
      </div>

      <ul className={styles.list}>
        {fixes.map((f) => (
          <li key={`${f.business}-${f.suburb}-${f.problem}`} className={styles.card} data-fix>
            <div className={styles.top}>
              <span className={styles.who}>
                {f.business} · {f.suburb}
              </span>
              {f.example && <span className={styles.example}>Example</span>}
            </div>
            <dl className={styles.rows}>
              <div>
                <dt>Problem</dt>
                <dd>{f.problem}</dd>
              </div>
              <div>
                <dt>Result</dt>
                <dd>{f.result}</dd>
              </div>
            </dl>
            <p className={styles.time}>
              <i className={styles.dot} aria-hidden="true" /> Fixed in {f.turnaround.toLowerCase()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
