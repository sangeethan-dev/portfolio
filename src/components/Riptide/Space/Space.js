"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { space } from "@/content/riptide";
import Eyebrow from "../ui/Eyebrow";
import useWordReveal from "../ui/useWordReveal";
import styles from "./Space.module.css";

export default function Space() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useWordReveal(titleRef, { scrub: true, start: "top 85%" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray(`.${styles.shot}`, rootRef.current).forEach((shot, i) => {
          const img = shot.querySelector("img");
          gsap.fromTo(
            img,
            { yPercent: -12 },
            {
              yPercent: 12,
              ease: "none",
              scrollTrigger: { trigger: shot, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
          // each frame drifts at its own speed, like layers in a dolly shot
          gsap.fromTo(
            shot,
            { y: 60 + i * 40 },
            {
              y: -(20 + i * 30),
              ease: "none",
              scrollTrigger: { trigger: shot, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.section} aria-labelledby="space-title">
      <div className={styles.wrap}>
        <Eyebrow>The space</Eyebrow>
        <h2 ref={titleRef} id="space-title" className={styles.title}>
          A clinic built for <em>movement.</em>
        </h2>

        <div className={styles.grid}>
          {space.shots.map((s, i) => (
            <figure key={s.label} className={`${styles.shot} ${styles[`s${i}`]}`}>
              <div className={styles.frame}>
                <img src={s.img} alt={s.label} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <strong>{s.label}</strong>
                <span>{s.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
