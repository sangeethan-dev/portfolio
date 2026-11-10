"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { fees } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import Button from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";
import useWordReveal from "../ui/useWordReveal";
import styles from "./Fees.module.css";

function Tick() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <circle cx="10" cy="10" r="9.25" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="m6 10.3 2.6 2.6L14.2 7" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Fees() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const { open } = useBooking();

  useWordReveal(titleRef);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(rootRef);
        gsap.from(q(`.${styles.row}`), {
          autoAlpha: 0,
          y: 24,
          stagger: 0.07,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: q(`.${styles.table}`)[0], start: "top 80%", once: true },
        });
        gsap.from(q(`.${styles.leader}`), {
          scaleX: 0,
          transformOrigin: "left",
          stagger: 0.07,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: q(`.${styles.table}`)[0], start: "top 80%", once: true },
        });
        gsap.from(q(`.${styles.cover} li`), {
          autoAlpha: 0,
          y: 24,
          stagger: 0.06,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: q(`.${styles.cover}`)[0], start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="fees" className={styles.section} aria-labelledby="fees-title">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <Eyebrow>Fees</Eyebrow>
          <h2 ref={titleRef} id="fees-title" className={styles.title}>
            Fees &amp; rebates, <em>in plain words</em>
          </h2>
          <p className={styles.intro}>{fees.intro}</p>
        </header>

        <div className={styles.grid}>
          <div className={styles.table}>
            {fees.rows.map((r) => (
              <div key={r.item} className={styles.row}>
                <span className={styles.item}>
                  {r.item}
                  <small>{r.time}</small>
                </span>
                <i className={styles.leader} aria-hidden="true" />
                <span className={styles.price}>{r.price}</span>
              </div>
            ))}
            <p className={styles.note}>
              What you get back depends on your health fund and level of extras cover. We’re happy to check before your visit.
            </p>
            <Button onClick={() => open({ type: "new" })}>Book an initial consultation</Button>
          </div>

          <ul className={styles.cover}>
            {fees.cover.map((c) => (
              <li key={c.title}>
                <span className={styles.tick}>
                  <Tick />
                </span>
                <strong>{c.title}</strong>
                <span>{c.line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
