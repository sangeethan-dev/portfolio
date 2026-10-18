"use client";

import { useRef } from "react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { scrollToSection } from "@/lib/lenis/useLenis";
import { manifesto } from "@/content/site";
import styles from "./Manifesto.module.css";

/*
 * The studio statement. Words start dim and light up one by one as the
 * paragraph scrolls through the viewport (scrubbed, so it reverses too).
 */
export default function Manifesto() {
  const rootRef = useRef(null);
  const statementRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const split = SplitText.create(statementRef.current, { type: "words" });
        gsap.set(split.words, { opacity: 0.16 });
        gsap.to(split.words, {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: {
            trigger: statementRef.current,
            start: "top 80%",
            end: "bottom 45%",
            scrub: true,
          },
        });

        gsap.from(rootRef.current.querySelectorAll("[data-mf-fade]"), {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rootRef.current.querySelector("[data-mf-foot]"), start: "top 90%", once: true },
        });

        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="statement" ref={rootRef} className={styles.section} data-theme-section="blueprint">
      <div className="container">
        <span className="label">Fig. 02 — Statement</span>

        <p ref={statementRef} className={styles.statement}>
          {manifesto.statement}
        </p>

        <span className={styles.cross} aria-hidden="true" />

        <div className={styles.foot} data-mf-foot>
          <p className={styles.pillars} data-mf-fade>
            {manifesto.pillars.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </p>

          <div className={styles.mission} data-mf-fade>
            <p>{manifesto.mission}</p>
            <a
              href="#about"
              className={styles.more}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#about", 0);
              }}
            >
              More about me <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
