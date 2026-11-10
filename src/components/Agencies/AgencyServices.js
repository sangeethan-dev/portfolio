"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { agency } from "@/content/site";
import styles from "./Agencies.module.css";

/*
 * Services as a stacked index of big titles (after trionn's services list).
 * Rows rise in on scroll; on hover a row floods with ink from the bottom and
 * its arrow swings round.
 */
/* Reused on the homepage with its own list and copy */
export default function AgencyServices({
  fig = "Fig. 03 — Services",
  title = "What I build for your clients.",
  intro = "The work agencies send me most. If it's a website and it's on your client list, I can probably take it off your hands.",
  items = agency.services,
}) {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const rows = gsap.utils.toArray("[data-service]", rootRef.current);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        rows.forEach((row) => {
          gsap.from(row.querySelectorAll("[data-cell]"), {
            yPercent: 60,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
            scrollTrigger: { trigger: row, start: "top 90%", once: true },
          });
        });
      });

      mm.add(`${MQ.motion} and ${MQ.finePointer}`, () => {
        const offs = rows.map((row) => {
          const fill = row.querySelector("[data-fill]");
          const arrow = row.querySelector("[data-arrow]");
          gsap.set(fill, { scaleY: 0, transformOrigin: "center bottom" });
          const enter = () => {
            row.dataset.hot = "true";
            gsap.to(fill, { scaleY: 1, duration: 0.5, ease: "expo.out", overwrite: true });
            gsap.to(arrow, { rotate: 0, duration: 0.5, ease: "expo.out", overwrite: true });
          };
          const leave = () => {
            delete row.dataset.hot;
            gsap.to(fill, { scaleY: 0, duration: 0.45, ease: "expo.inOut", overwrite: true });
            gsap.to(arrow, { rotate: -45, duration: 0.45, ease: "expo.inOut", overwrite: true });
          };
          row.addEventListener("mouseenter", enter);
          row.addEventListener("mouseleave", leave);
          return () => {
            row.removeEventListener("mouseenter", enter);
            row.removeEventListener("mouseleave", leave);
          };
        });
        return () => offs.forEach((f) => f());
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="services" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">{fig}</span>
        <h2 ref={titleRef} className={styles.title}>
          {title}
        </h2>
        <p className={styles.intro}>{intro}</p>
      </div>

      <ol className={`container ${styles.services}`}>
        {items.map((s, i) => (
          <li key={s.title} className={styles.service} data-service>
            <span className={styles.serviceFill} data-fill aria-hidden="true" />
            <span className={styles.serviceNum} data-cell>
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className={styles.serviceTitle} data-cell>
              {s.title}
            </h3>
            <p className={styles.serviceDesc} data-cell>
              {s.desc}
            </p>
            <span className={styles.serviceArrow} data-arrow aria-hidden="true">
              →
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
