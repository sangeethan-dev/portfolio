"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

const quoteWords = [
  { text: "I" },
  { text: "build" },
  { text: "websites" },
  { text: "that" },
  { text: "people" },
  { text: "remember", em: true, acc: true },
  { text: "—" },
  { text: "and" },
  { text: "developers" },
  { text: "respect.", em: true },
];

const stats = [
  { value: 8,  suffix: "",  label: "Years experience" },
  { value: 30, suffix: "+", label: "Websites delivered" },
  { value: 3,  suffix: "",  label: "Platforms mastered" },
];

export default function About() {
  const sectionRef  = useRef(null);
  const wordRefs    = useRef([]);
  const bodyLineRef = useRef(null);
  const bodyTextRef = useRef(null);
  const statCellRefs = useRef([]);
  const statNumRefs  = useRef([]);
  const footerRef   = useRef(null);

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean);
    const cells = statCellRefs.current.filter(Boolean);

    gsap.set(words,           { opacity: 0.15 });
    gsap.set(bodyLineRef.current, { height: 0 });
    gsap.set(bodyTextRef.current, { opacity: 0, y: 16 });
    gsap.set(cells,           { opacity: 0, y: 20 });
    gsap.set(footerRef.current, { opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top 75%",
      once:    true,
      onEnter() {
        gsap.to(words, {
          opacity:  1,
          duration: 0.6,
          ease:     "power2.out",
          stagger:  0.1,
          delay:    0.2,
        });

        gsap.to(bodyTextRef.current, {
          opacity:  1,
          y:        0,
          duration: 0.8,
          ease:     "power3.out",
          delay:    0.8,
        });

        gsap.to(bodyLineRef.current, {
          height:   "100%",
          duration: 1.2,
          ease:     "power3.out",
          delay:    1.2,
        });

        gsap.to(cells, {
          opacity:  1,
          y:        0,
          duration: 0.7,
          ease:     "power3.out",
          stagger:  0.1,
          delay:    1.4,
        });

        const counterDelays = [0, 150, 300];
        statNumRefs.current.filter(Boolean).forEach((el, i) => {
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || "";
          setTimeout(() => {
            let count = 0;
            const step = Math.ceil(target / 20);
            const id = setInterval(() => {
              count = Math.min(count + step, target);
              el.textContent = count + suffix;
              if (count >= target) clearInterval(id);
            }, 40);
          }, 1400 + counterDelays[i]);
        });

        gsap.to(footerRef.current, {
          opacity:  1,
          duration: 0.6,
          delay:    1.8,
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} id="about" className={styles.section}>
      <div className="container">
        <div className={styles.inner}>

          <div className={styles.topRow}>
            <span className={styles.label}>About</span>
            <p className={styles.quote}>
              {quoteWords.map((w, i) => {
                let cls = styles.word;
                if (w.em)  cls += ` ${styles.em}`;
                if (w.acc) cls += ` ${styles.acc}`;
                return (
                  <span
                    key={i}
                    ref={(el) => (wordRefs.current[i] = el)}
                    className={cls}
                  >
                    {w.text}
                  </span>
                );
              })}
            </p>
          </div>

          <div className={styles.bodyStats}>

            <div className={styles.bodyWrap}>
              <div ref={bodyLineRef} className={styles.bodyLine} />
              <p ref={bodyTextRef} className={styles.body}>
                8 years of frontend development across{" "}
                <strong>WordPress, Shopify, and Next.js</strong>. I came up
                through a digital marketing agency — so I don&apos;t just think
                about how a site looks. I think about how it{" "}
                <strong>performs, converts, and represents the brand</strong>{" "}
                behind it. Clean code. Smooth animations. Zero bloat. That&apos;s
                how I work.
              </p>
            </div>

            <div className={styles.statsCol}>
              {stats.map((s, i) => (
                <div
                  key={i}
                  ref={(el) => (statCellRefs.current[i] = el)}
                  className={styles.statItem}
                >
                  <div className={styles.statRow}>
                    <span
                      ref={(el) => (statNumRefs.current[i] = el)}
                      className={styles.statNum}
                      data-target={s.value}
                      data-suffix={s.suffix}
                    >
                      0{s.suffix}
                    </span>
                    <span className={styles.statLabel}>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div ref={footerRef} className={styles.footer}>
            <div className={styles.location}>
              <span className={styles.dot} />
              Based in Sri Lanka · Available worldwide
            </div>
            <span className={styles.availability}>Open for new projects</span>
          </div>

        </div>
      </div>
    </section>
  );
}
