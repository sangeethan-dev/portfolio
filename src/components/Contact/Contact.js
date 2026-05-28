"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Contact.module.css";

gsap.registerPlugin(ScrollTrigger);

const headlineWords = [
  { text: "Let's" },
  { text: "build" },
  { text: "something" },
  { text: "great.", em: true },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const labelRef   = useRef(null);
  const wordRefs   = useRef([]);
  const subRef     = useRef(null);
  const infoRef    = useRef(null);

  useEffect(() => {
    const words = wordRefs.current.filter(Boolean);

    gsap.set(labelRef.current,  { opacity: 0, y: 24 });
    gsap.set(words,             { opacity: 0.15 });
    gsap.set(subRef.current,    { opacity: 0, y: 24 });
    gsap.set(infoRef.current,   { opacity: 0, y: 16 });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top 80%",
      once:    true,
      onEnter() {
        gsap.to(labelRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        });
        gsap.to(words, {
          opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1, delay: 0.2,
        });
        gsap.to(subRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5,
        });
        gsap.to(infoRef.current, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay: 0.8,
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className="container">
        <div className={styles.card}>

          <div className={styles.header}>
            <span ref={labelRef} className={styles.label}>Contact</span>
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
            <p ref={subRef} className={styles.sub}>
              Have a project in mind? Let&apos;s talk.<br />
              I reply within 24 hours.
            </p>
          </div>

          <div ref={infoRef} className={styles.info}>
            <a href="mailto:email2geethan@gmail.com" className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>email2geethan@gmail.com</span>
            </a>
            <div className={styles.infoDivider} />
            <a href="https://wa.me/94756144113" target="_blank" rel="noopener noreferrer" className={styles.infoItem}>
              <span className={styles.infoLabel}>Mobile</span>
              <span className={styles.infoValue}>+94 75 6144113</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
