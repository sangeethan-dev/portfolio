"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Services.module.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num:   "01",
    cat:   "CMS",
    title: "Custom WordPress Websites",
    desc:  "Hand-coded themes with custom CMS fields. Minimal plugins, no page builders — clean code your team can manage.",
  },
  {
    num:   "02",
    cat:   "E-Commerce",
    title: "Shopify Custom Themes",
    desc:  "Bespoke storefronts built to convert. Fast, flexible, on-brand — no cookie-cutter templates.",
  },
  {
    num:   "03",
    cat:   "Animation",
    title: "Animated Landing Pages",
    desc:  "GSAP-powered scroll storytelling and interactions that hold attention from the first scroll.",
  },
  {
    num:   "04",
    cat:   "Frontend",
    title: "Next.js Frontend Development",
    desc:  "Component-driven, performant frontends — ready for any backend or headless CMS.",
  },
];

const headlineWords = [
  { text: "What" },
  { text: "I" },
  { text: "build.", em: true },
];

export default function Services() {
  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const wordRefs   = useRef([]);
  const cellRefs   = useRef([]);

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean);
    const cells = cellRefs.current.filter(Boolean);

    gsap.set(labelRef.current, { opacity: 0, y: 24 });
    gsap.set(words,            { opacity: 0.15 });
    gsap.set(cells,            { opacity: 0, y: 24 });

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
          stagger:  0.1,
          delay:    0.2,
        });
        gsap.to(cells, {
          opacity:  1,
          y:        0,
          duration: 0.7,
          ease:     "power3.out",
          stagger:  0.12,
          delay:    0.6,
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} id="services" className={styles.section}>

      <div className={`container ${styles.header}`}>
        <p ref={labelRef} className={styles.label}>Services</p>
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

      <div className="container">
        <div className={styles.grid}>
          {services.map((item, i) => (
            <div
              key={item.num}
              ref={(el) => (cellRefs.current[i] = el)}
              className={styles.cell}
            >
              <div className={styles.shimmer} />
              <div className={styles.ghostNum}>{item.num}</div>
              <div className={styles.cellContent}>
                <p className={styles.cellCat}>{item.cat}</p>
                <p className={styles.cellTitle}>{item.title}</p>
                <p className={styles.cellDesc}>{item.desc}</p>
              </div>
              <div className={styles.cellLine} />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
