"use client";

import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { clinic, faq } from "@/content/riptide";
import Eyebrow from "../ui/Eyebrow";
import useWordReveal from "../ui/useWordReveal";
import styles from "./Faq.module.css";

function Item({ q, a, i, open, onToggle }) {
  const bodyRef = useRef(null);
  const iconRef = useRef(null);
  const first = useRef(true);

  useGSAP(
    () => {
      const reduced = window.matchMedia(MQ.reduced).matches;
      const d = first.current || reduced ? 0 : 0.6;
      first.current = false;
      gsap.to(bodyRef.current, { height: open ? "auto" : 0, duration: d, ease: "expo.out" });
      gsap.to(iconRef.current, { rotate: open ? 45 : 0, duration: d * 0.8, ease: "power3.out" });
    },
    { dependencies: [open] }
  );

  return (
    <li className={`${styles.item} ${open ? styles.open : ""}`}>
      <h3 className={styles.qWrap}>
        <button
          type="button"
          className={styles.q}
          aria-expanded={open}
          aria-controls={`faq-${i}`}
          id={`faq-q-${i}`}
          onClick={onToggle}
        >
          <span className={styles.num}>0{i + 1}</span>
          <span className={styles.qText}>{q}</span>
          <span ref={iconRef} className={styles.icon} aria-hidden="true">
            <svg viewBox="0 0 20 20" width="20" height="20">
              <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
        </button>
      </h3>
      <div ref={bodyRef} id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={styles.body}>
        <p>{a}</p>
      </div>
    </li>
  );
}

export default function Faq() {
  const titleRef = useRef(null);
  const [openIdx, setOpenIdx] = useState(0);

  useWordReveal(titleRef);

  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <Eyebrow>FAQ</Eyebrow>
          <h2 ref={titleRef} id="faq-title" className={styles.title}>
            Quick <em>questions</em>
          </h2>
          <p className={styles.more}>
            Something else? Call us on <a href={clinic.phoneHref}>{clinic.phone}</a>. A real person answers from 6am.
          </p>
        </header>
        <ul className={styles.list}>
          {faq.items.map((f, i) => (
            <Item key={f.q} {...f} i={i} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}
