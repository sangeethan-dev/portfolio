"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useSectionNav from "@/lib/lenis/useSectionNav";
import { agency, aud } from "@/content/site";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
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
        <span className="label">Fig. 06 — Rates</span>
        <h2 ref={titleRef} className={styles.title}>
          Fixed rates. Your margin stays yours.
        </h2>
        <p className={styles.intro}>
          Every project gets a fixed quote before I start, in AUD and invoiced to your agency. Mark it up however
          you like. Your client never sees my price.
        </p>
      </div>

      <div className={`container ${styles.rateWrap}`}>
        <dl className={styles.rates} data-rates>
          {agency.rates.map((r) => (
            <div key={r.label} className={styles.rate} data-rate>
              <dt className={styles.rateLabel}>{r.label}</dt>
              <dd className={styles.rateBody}>
                <span className={styles.rateAmount}>
                  {r.amount ? (
                    <>
                      {r.prefix && <span className={styles.ratePrefix}>{r.prefix} </span>}
                      {aud(r.amount)}
                      {r.suffix && <span className={styles.rateSuffix}> {r.suffix}</span>}
                    </>
                  ) : (
                    <span className={styles.rateAsk}>On request</span>
                  )}
                </span>
                {r.note && <span className={styles.rateNote}>{r.note}</span>}
              </dd>
            </div>
          ))}
        </dl>

        {agency.firstProject && (
          <p className={styles.offer} data-rate>
            <span className={styles.offerTag}>{agency.firstProject.tag}</span>
            <span>{agency.firstProject.text}</span>
          </p>
        )}

        <ArrowLink href="#contact" className={styles.rateCta} onClick={(e) => go("#contact", e)}>
          Get a fixed quote
        </ArrowLink>
      </div>
    </section>
  );
}
