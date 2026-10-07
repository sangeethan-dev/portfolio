"use client";

import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { selectService } from "@/lib/enquiry";
import { packages, offer, aud, WEBSITE_WITH_CARE } from "@/content/site";
import Odometer from "./Odometer";
import styles from "./Pricing.module.css";

function Cta({ children, onClick, featured }) {
  const ref = useMagnetic(0.25);
  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.cta}${featured ? ` ${styles.ctaFeatured}` : ""}`}
      onClick={onClick}
    >
      <span data-magnetic-inner>
        {children} <span aria-hidden="true">→</span>
      </span>
    </button>
  );
}

export default function Pricing() {
  const rootRef = useRef(null);
  const addonRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const [withCare, setWithCare] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const mm = gsap.matchMedia();

      mm.add(MQ.reduced, () => {
        q("[data-strip]").forEach((s) => {
          gsap.set(s, { yPercent: -(10 + Number(s.dataset.digit)) * 5 });
        });
      });

      mm.add(MQ.motion, () => {
        const cards = q("[data-price-card]");
        gsap.set(cards, { y: 80, autoAlpha: 0 });
        gsap.set(q("[data-tick]"), { drawSVG: "0%" });
        gsap.set(q("[data-feature]"), { autoAlpha: 0, x: -10 });
        gsap.set(q("[data-strike]"), { scaleX: 0 });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 80%", once: true },
        });
        tl.to(cards, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.12 });

        // Odometers roll, rightmost digit spins longest
        q("[data-price-card]").forEach((card, ci) => {
          const strips = card.querySelectorAll("[data-strip]");
          strips.forEach((s, i) => {
            const d = Number(s.dataset.digit);
            tl.fromTo(
              s,
              { yPercent: 0 },
              {
                yPercent: -(10 + d) * 5, // strip is 20 digits tall → 5% per digit
                duration: 1.4 + (strips.length - i) * 0.15,
                ease: "expo.out",
              },
              0.25 + ci * 0.12
            );
          });
          tl.to(card.querySelectorAll("[data-strike]"), { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 0.45 + ci * 0.12);
          tl.to(card.querySelectorAll("[data-feature]"), { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.07, ease: "power3.out" }, 0.6 + ci * 0.12);
          tl.to(card.querySelectorAll("[data-tick]"), { drawSVG: "100%", duration: 0.4, stagger: 0.07, ease: "power2.out" }, 0.7 + ci * 0.12);
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* Care Plan add-on reveal */
  useGSAP(
    () => {
      const el = addonRef.current;
      const reduced = window.matchMedia(MQ.reduced).matches;
      gsap.to(rootRef.current.querySelector("[data-switch-thumb]"), {
        x: withCare ? 20 : 0,
        duration: reduced ? 0 : 0.45,
        ease: "back.out(2.2)",
      });
      gsap.to(el, {
        height: withCare ? "auto" : 0,
        autoAlpha: withCare ? 1 : 0,
        duration: reduced ? 0 : 0.5,
        ease: "expo.out",
      });
    },
    { dependencies: [withCare], scope: rootRef }
  );

  return (
    <section id="pricing" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 05 — Pricing</span>
        <h2 ref={titleRef} className={styles.title}>
          Clear pricing. No surprises.
        </h2>
        <p className={styles.intro}>
          One fixed price to build your website, and one small monthly fee to keep it healthy. You&apos;ll know
          the total before any work starts.
        </p>
      </div>

      <div className={`container ${styles.grid}`} data-grid>
        {packages.map((p) => (
          <article
            key={p.id}
            className={`${styles.card}${p.featured ? ` ${styles.featured}` : ""}`}
            data-price-card
          >
            <div className={styles.cardTop}>
              <span className={styles.cardNum}>{p.num}</span>
              {p.was && <span className={styles.flag}>Intro offer</span>}
            </div>

            <h3 className={styles.cardTitle}>{p.title}</h3>

            {p.was && (
              <span className={styles.was}>
                <span className="sr-only">Usually </span>
                <span>{aud(p.was)}</span>
                <i className={styles.strike} data-strike aria-hidden="true" />
              </span>
            )}

            <div className={`${styles.price}${p.was ? ` ${styles.priceOffer}` : ""}`}>
              {p.amount ? (
                <>
                  <span className={styles.priceMeta}>
                    <span>{p.currency}</span>
                  </span>
                  <span className={styles.amount}>
                    <Odometer value={p.amount} />
                  </span>
                  {p.suffix && <span className={styles.priceMeta}>{p.suffix}</span>}
                </>
              ) : (
                <span className={`${styles.amount} ${styles.amountText}`}>{p.priceLabel}</span>
              )}
            </div>

            {p.note && <p className={styles.offerNote}>{p.note}</p>}

            {p.id === "website" && (
              <div className={styles.addonWrap}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={withCare}
                  className={styles.switch}
                  onClick={() => setWithCare((v) => !v)}
                >
                  <span className={styles.switchTrack}>
                    <span className={styles.switchThumb} data-switch-thumb />
                  </span>
                  Add the Care Plan
                </button>
                <div ref={addonRef} className={styles.addon}>
                  <p>
                    + {aud(offer.care)} / month for your first {offer.careMonths} months — updates, backups,
                    monitoring and monthly edits from launch day.
                  </p>
                </div>
              </div>
            )}

            <p className={styles.desc}>{p.desc}</p>

            <ul className={styles.features}>
              {p.features.map((f) => (
                <li key={f} className={styles.feature} data-feature>
                  <svg viewBox="0 0 16 16" className={styles.tick} aria-hidden="true">
                    <path data-tick d="M2.5 8.5 L6.5 12 L13.5 4" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            <Cta
              featured={p.featured}
              onClick={() => selectService(p.id === "website" && withCare ? WEBSITE_WITH_CARE : p.title)}
            >
              {p.cta}
            </Cta>
          </article>
        ))}
      </div>

      <p className={`container ${styles.note}`}>
        All prices in AUD. Not sure what you need? Tell me about your practice and I&apos;ll recommend the right
        option.
      </p>
    </section>
  );
}
