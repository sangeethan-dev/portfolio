"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { mantra } from "@/content/site";
import styles from "./Mantra.module.css";

/* Enough copies that a band never shows its end while it slides */
const REPEAT = 4;

function Band({ className, dir, words }) {
  return (
    <div className={`${styles.band} ${className}`} data-band={dir} aria-hidden="true">
      <div className={styles.track} data-track>
        {Array.from({ length: REPEAT }).flatMap((_, r) =>
          words.map((w) => (
            <span key={`${r}-${w}`} className={styles.item}>
              {w}
              <i className={styles.plus} />
            </span>
          ))
        )}
      </div>
    </div>
  );
}

/*
 * Two giant word bands cross the screen at opposing angles and slide in
 * opposite directions as you scroll past — the three things a small
 * business website has to do. Reused on /agencies with its own words.
 */
export default function Mantra({ content = mantra }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        rootRef.current.querySelectorAll("[data-band]").forEach((band) => {
          const track = band.querySelector("[data-track]");
          const left = band.dataset.band === "left";
          gsap.fromTo(
            track,
            { xPercent: left ? 0 : -25 },
            {
              xPercent: left ? -25 : 0,
              ease: "none",
              scrollTrigger: {
                trigger: rootRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.section} data-theme-section="blueprint" aria-label={content.label}>
      <p className={`label ${styles.kicker}`}>{content.kicker}</p>
      <Band className={styles.back} dir="right" words={content.words} />
      <Band className={styles.front} dir="left" words={content.words} />
      <p className={`label ${styles.caption}`}>
        <span aria-hidden="true">✦</span> {content.caption}
      </p>
    </section>
  );
}
