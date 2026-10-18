"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { contact, privacy } from "@/content/site";
import styles from "./Privacy.module.css";

export default function Privacy() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines", start: "top 100%" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray("[data-block]", rootRef.current).forEach((el) => {
          gsap.from(el, {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="top" ref={rootRef} className={styles.section} data-theme-section="blueprint">
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <span className="label">Fig. 01 — Privacy</span>
          <h1 ref={titleRef} className={styles.title}>
            Your details, kept simple.
          </h1>
          <p className={styles.updated}>Last updated {privacy.updated}</p>
        </div>

        <div className={styles.body}>
          {privacy.sections.map((s, i) => (
            <div key={s.title} className={styles.block} data-block>
              <span className={styles.num}>0{i + 1}</span>
              <div>
                <h2 className={styles.blockTitle}>{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}

          <div className={styles.block} data-block>
            <span className={styles.num}>0{privacy.sections.length + 1}</span>
            <div>
              <h2 className={styles.blockTitle}>Contact</h2>
              <p>
                Questions about your data, or want it deleted? Email{" "}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
