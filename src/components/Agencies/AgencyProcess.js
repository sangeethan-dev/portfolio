"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { agency } from "@/content/site";
import styles from "./Agencies.module.css";

/* Six steps on one track. The track fills as you scroll through it and
   each step lights up as the fill reaches its dot. */
export default function AgencyProcess() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // re-runs when crossing the breakpoint, where the track turns vertical
      mm.add({ motion: MQ.motion, vertical: "(max-width: 1023px)" }, (ctx) => {
        if (!ctx.conditions.motion) return;
        const { vertical } = ctx.conditions;
        const steps = gsap.utils.toArray("[data-step]", rootRef.current);
        const fill = rootRef.current.querySelector("[data-fill]");

        gsap.set(steps, { opacity: 0.25 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current.querySelector("[data-track]"),
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        });
        tl.fromTo(fill, vertical ? { scaleY: 0 } : { scaleX: 0 }, { ...(vertical ? { scaleY: 1 } : { scaleX: 1 }), ease: "none", duration: 1 }, 0);
        steps.forEach((step, i) => {
          tl.to(step, { opacity: 1, duration: 0.1, ease: "none" }, (i / steps.length) * 0.9);
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 06 — Process</span>
        <h2 ref={titleRef} className={styles.title}>
          From brief to launch, under your brand.
        </h2>
      </div>

      <div className={`container ${styles.process}`} data-track>
        <span className={styles.track} aria-hidden="true">
          <i className={styles.trackFill} data-fill />
        </span>
        <ol className={styles.steps}>
          {agency.process.map((p, i) => (
            <li key={p.title} className={styles.step} data-step>
              <i className={styles.stepDot} aria-hidden="true" />
              <span className={styles.stepNum}>Step {String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.stepTitle}>{p.title}</h3>
              <p className={styles.stepDesc}>{p.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
