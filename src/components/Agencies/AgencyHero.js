"use client";

import { useRef } from "react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import useSectionNav from "@/lib/lenis/useSectionNav";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { agency } from "@/content/site";
import BlueprintGrid from "../Hero/BlueprintGrid";
import styles from "./AgencyHero.module.css";

export default function AgencyHero() {
  const rootRef = useRef(null);
  const h1Ref = useRef(null);
  const primaryRef = useMagnetic(0.3);
  const go = useSectionNav();

  /* No preloader on this page: the headline rises in on mount */
  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const split = SplitText.create(h1Ref.current, { type: "lines,words", mask: "lines" });
        gsap
          .timeline({ delay: 0.15 })
          .from(split.words, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.05 })
          .from(q("[data-ah-fade]"), { autoAlpha: 0, y: 20, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.5);

        gsap.to(q("[data-ah-inner]"), {
          yPercent: -10,
          autoAlpha: 0.3,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="top" ref={rootRef} className={styles.hero} data-theme-section="blueprint">
      <BlueprintGrid className={styles.grid} />

      <div className={`container ${styles.inner}`} data-ah-inner>
        <div className={styles.topRow} data-ah-fade>
          <span className="label">Fig. 01 — For agencies</span>
          <span className="label">
            <i className={styles.liveDot} /> White-label · NDA by default
          </span>
        </div>

        <h1 ref={h1Ref} className={styles.headline}>
          {agency.hero.title}
        </h1>

        <div className={styles.bottom}>
          <div className={styles.ctas} data-ah-fade>
            <a ref={primaryRef} href="#contact" className={styles.link} onClick={(e) => go("#contact", e)}>
              <span data-magnetic-inner>
                Brief me on a project <span aria-hidden="true">→</span>
              </span>
            </a>
            <a href="#rates" className={styles.link} onClick={(e) => go("#rates", e)}>
              <span>
                See rates <span aria-hidden="true">↓</span>
              </span>
            </a>
          </div>

          <div className={styles.side} data-ah-fade>
            <div className={styles.plate}>
              <span className={styles.plateCell}>
                AEST
                <b>−4.5h</b>
              </span>
              <span className={styles.plateCell}>Changes ready by your next morning.</span>
            </div>
            <p className={styles.sub}>{agency.hero.sub}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
