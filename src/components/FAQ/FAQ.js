"use client";

import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { faqs } from "@/content/site";
import styles from "./FAQ.module.css";

export default function FAQ() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const [open, setOpen] = useState(0);

  /* Height + icon animate on every change of the open item */
  useGSAP(
    () => {
      const reduced = window.matchMedia(MQ.reduced).matches;
      const items = rootRef.current.querySelectorAll("[data-faq]");
      items.forEach((item, i) => {
        const body = item.querySelector("[data-faq-body]");
        const icon = item.querySelector("[data-faq-icon]");
        const isOpen = i === open;
        gsap.to(body, {
          height: isOpen ? "auto" : 0,
          autoAlpha: isOpen ? 1 : 0,
          duration: reduced ? 0 : 0.6,
          ease: "expo.out",
          overwrite: true,
        });
        gsap.to(icon, { rotate: isOpen ? 45 : 0, duration: reduced ? 0 : 0.5, ease: "back.out(2)", overwrite: true });
      });
    },
    { dependencies: [open], scope: rootRef }
  );

  return (
    <section id="faq" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <span className="label">Fig. 07 — FAQ</span>
          <h2 ref={titleRef} className={styles.title}>
            Questions, answered.
          </h2>
        </div>

        <div className={styles.list}>
          {faqs.map((f, i) => {
            const isOpen = i === open;
            const id = `faq-${i}`;
            return (
              <div key={f.q} className={`${styles.item}${isOpen ? ` ${styles.open}` : ""}`} data-faq>
                <h3 className={styles.qWrap}>
                  <button
                    type="button"
                    className={styles.q}
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.qText}>{f.q}</span>
                    <span className={styles.icon} data-faq-icon aria-hidden="true" />
                  </button>
                </h3>
                <div id={id} className={styles.body} data-faq-body role="region">
                  <p className={styles.a}>{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
