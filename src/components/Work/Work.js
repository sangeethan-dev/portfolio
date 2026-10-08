"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { concepts } from "@/content/site";
import ClinicConcept from "./concepts/ClinicConcept";
import CafeConcept from "./concepts/CafeConcept";
import StoreConcept from "./concepts/StoreConcept";
import styles from "./Work.module.css";

const PREVIEWS = {
  clinic: ClinicConcept,
  cafe: CafeConcept,
  store: StoreConcept,
};

export default function Work() {
  const rootRef = useRef(null);
  const headRef = useSplitReveal({ type: "lines" });

  /* Stacked cards: each card shrinks back and dims as the next slides over */
  useGSAP(
    () => {
      const cards = gsap.utils.toArray("[data-card]", rootRef.current);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const triggers = cards.slice(0, -1).map((card, i) => {
          const next = cards[i + 1];
          const shade = card.querySelector("[data-shade]");
          return ScrollTrigger.create({
            trigger: next,
            start: "top bottom",
            end: "top 15%",
            scrub: true,
            animation: gsap
              .timeline()
              .to(card, { scale: 0.92, ease: "none" }, 0)
              .to(shade, { autoAlpha: 0.55, ease: "none" }, 0),
          });
        });
        return () => triggers.forEach((t) => t.kill());
      });

      mm.add(MQ.motion, () => {
        // cards rise in on first appearance
        cards.forEach((card) => {
          gsap.from(card.querySelector("[data-card-inner]"), {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 85%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="work" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 03 — Work</span>
        <h2 ref={headRef} className={styles.title}>
          Concept projects
        </h2>
        <p className={styles.intro}>
          My client work is under NDA, so I can&apos;t show it here. Instead I built
          these three. The businesses are made up, but the websites are real and they
          work, so go ahead and try them.
        </p>
      </div>

      <div className={`container ${styles.stack}`}>
        {concepts.map((c, i) => {
          const Preview = PREVIEWS[c.id];
          return (
            <article key={c.id} className={styles.card} data-card>
              <div className={styles.cardInner} data-card-inner>
                <div className={styles.info}>
                  <div className={styles.metaRow}>
                    <span className={styles.badge}>Concept project</span>
                    <span className={styles.num}>0{i + 1} / 0{concepts.length}</span>
                  </div>

                  <h3 className={styles.name}>{c.name}</h3>
                  <p className={styles.sector}>{c.sector}</p>
                  <p className={styles.brief}>{c.brief}</p>

                  <ul className={styles.built}>
                    {c.built.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  <div className={styles.foot}>
                    <span className={styles.pkg}>
                      <span className={styles.pkgLabel}>Package</span>
                      {c.package}
                    </span>
                    <span className={styles.hint}>
                      <i className={styles.hintDot} />
                      {c.hint}
                    </span>
                  </div>
                </div>

                <div className={styles.preview}>
                  <Preview />
                </div>
              </div>
              <span className={styles.shade} data-shade aria-hidden="true" />
            </article>
          );
        })}
      </div>
    </section>
  );
}
