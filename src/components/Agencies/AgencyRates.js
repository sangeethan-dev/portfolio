"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useSectionNav from "@/lib/lenis/useSectionNav";
import { agency, aud } from "@/content/site";
import styles from "./Agencies.module.css";

/* Rate sheet. A null amount reads "On request" until it's set in site.js. */
export default function AgencyRates() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const go = useSectionNav();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(gsap.utils.toArray("[data-rate]", rootRef.current), {
          y: 40,
          autoAlpha: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: rootRef.current.querySelector("[data-rates]"), start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="rates" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 04 — Rates</span>
        <h2 ref={titleRef} className={styles.title}>
          Fixed rates. Your margin stays yours.
        </h2>
        <p className={styles.intro}>
          Every project gets a fixed quote before I start, in AUD and invoiced to your agency. Mark it up however
          you like. Your client never sees my price.
        </p>
      </div>

      <div className={`container ${styles.rateWrap}`}>
        {agency.firstProject && (
          <p className={styles.offer}>
            <span className={styles.offerTag}>First project</span> {agency.firstProject}
          </p>
        )}

        <dl className={styles.rates} data-rates>
          {agency.rates.map((r) => (
            <div key={r.label} className={styles.rate} data-rate>
              <dt className={styles.rateLabel}>{r.label}</dt>
              <dd className={styles.rateAmount}>
                {r.amount ? (
                  <>
                    {aud(r.amount)}
                    {r.suffix && <span className={styles.rateSuffix}> {r.suffix}</span>}
                  </>
                ) : (
                  <span className={styles.rateAsk}>On request</span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <a href="#contact" className={styles.rateCta} onClick={(e) => go("#contact", e)}>
          Get a fixed quote <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
