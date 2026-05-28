"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./FAQ.module.css";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    num: "01",
    q: "Can you work from my Figma file?",
    a: "Yes — Figma, XD, or any design file. Pixel-perfect conversion is one of my core strengths.",
  },
  {
    num: "02",
    q: "Do you work with agencies?",
    a: "Absolutely. White-label development, clean handoff, and I stay behind the scenes if needed.",
  },
  {
    num: "03",
    q: "How long does a project take?",
    a: "Landing page: 5–7 days. Full website: 2–4 weeks depending on complexity.",
  },
  {
    num: "04",
    q: "Do you handle hosting and deployment?",
    a: "Yes — I set everything up and make sure it's fast and secure on your preferred host.",
  },
  {
    num: "05",
    q: "What about post-launch support?",
    a: "Included. Beyond that we can set up a retainer or handle changes per-request.",
  },
  {
    num: "06",
    q: "Why no real client work shown?",
    a: "Past projects were under NDA. The demos here represent my full capability — built to show what I can do at my best.",
  },
];

const headlineWords = [
  { text: "Good" },
  { text: "questions," },
  { text: "answered.", em: true },
];

export default function FAQ() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const wordRefs    = useRef([]);
  const countRef    = useRef(null);
  const itemRefs    = useRef([]);
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean);
    const items = itemRefs.current.filter(Boolean);

    gsap.set(labelRef.current,  { opacity: 0, y: 24 });
    gsap.set(words,             { opacity: 0.15 });
    gsap.set(countRef.current,  { opacity: 0, y: 24 });
    gsap.set(items,             { opacity: 0, y: 12 });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top 80%",
      once:    true,
      onEnter() {
        gsap.to(labelRef.current, {
          opacity:  1,
          y:        0,
          duration: 0.8,
          ease:     "power3.out",
        });
        gsap.to(words, {
          opacity:  1,
          duration: 0.6,
          ease:     "power2.out",
          stagger:  0.12,
          delay:    0.15,
        });
        gsap.to(countRef.current, {
          opacity:  1,
          y:        0,
          duration: 0.8,
          ease:     "power3.out",
          delay:    0.15,
        });
        gsap.to(items, {
          opacity:  1,
          y:        0,
          duration: 0.6,
          ease:     "power3.out",
          stagger:  0.08,
          delay:    0.45,
        });
      },
    });

    return () => st.kill();
  }, []);

  function toggle(i) {
    setOpenIdx((prev) => (prev === i ? null : i));
  }

  return (
    <section ref={sectionRef} id="faq" className={styles.section}>
      <div className="container">

        {/* ── Top row ────────────────────────────────────────────── */}
        <div className={styles.topRow}>
          <div className={styles.topLeft}>
            <span ref={labelRef} className={styles.label}>FAQ</span>
            <h2 className={styles.headline}>
              {headlineWords.map((w, i) => (
                <span
                  key={i}
                  ref={(el) => (wordRefs.current[i] = el)}
                  className={w.em ? `${styles.word} ${styles.wordEm}` : styles.word}
                >
                  {w.text}
                </span>
              ))}
            </h2>
          </div>
          <span ref={countRef} className={styles.count}>06 Questions</span>
        </div>

        {/* ── Accordion ──────────────────────────────────────────── */}
        <div className={styles.accordion}>
          {faqs.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={item.num}
                ref={(el) => (itemRefs.current[i] = el)}
                className={`${styles.accItem}${isOpen ? ` ${styles.accOpen}` : ""}`}
                onClick={() => toggle(i)}
              >
                {/* sweep bg */}
                <div className={styles.accSweep} />

                <div className={styles.accHead}>
                  <div className={styles.accLeft}>
                    <span className={styles.accNum}>{item.num}</span>
                    <span className={styles.accQ}>{item.q}</span>
                  </div>
                  <div className={styles.accIcon} />
                </div>

                <div className={styles.accBody}>
                  <p className={styles.accA}>{item.a}</p>
                </div>

                <div className={styles.accLine} />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
