"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { scrollToSection } from "@/lib/lenis/useLenis";
import { contact, offerLine } from "@/content/site";
import styles from "./Footer.module.css";

const WORD = "SANGEETHAN";

export default function Footer() {
  const rootRef = useRef(null);
  const wordRef = useRef(null);

  /* Letters rise toward the pointer and lean away from it */
  useEffect(() => {
    if (!window.matchMedia(MQ.finePointer).matches || window.matchMedia(MQ.reduced).matches) return;
    const root = rootRef.current;
    const letters = Array.from(wordRef.current.querySelectorAll("[data-letter]"));
    const setters = letters.map((el) => ({
      el,
      y: gsap.quickTo(el, "yPercent", { duration: 0.5, ease: "power3.out" }),
      r: gsap.quickTo(el, "rotate", { duration: 0.5, ease: "power3.out" }),
    }));

    function onMove(e) {
      setters.forEach(({ el, y, r }) => {
        const b = el.getBoundingClientRect();
        const dx = e.clientX - (b.left + b.width / 2);
        const reach = Math.max(0, 1 - Math.abs(dx) / 260);
        y(-reach * 22);
        r(reach * (dx > 0 ? -8 : 8));
      });
    }
    function onLeave() {
      setters.forEach(({ y, r }) => {
        y(0);
        r(0);
      });
    }
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <footer ref={rootRef} className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <p className={styles.tag}>
          {offerLine}
        </p>
        <nav className={styles.links} aria-label="Footer">
          <a href={`mailto:${contact.email}`}>Email</a>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={contact.inspirations} target="_blank" rel="noopener noreferrer">
            Experiments
          </a>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#top");
            }}
          >
            Back to top ↑
          </a>
        </nav>
      </div>

      <div ref={wordRef} className={styles.word} aria-label={WORD} role="img">
        {WORD.split("").map((ch, i) => (
          <span key={i} className={styles.letter} data-letter aria-hidden="true">
            {ch}
          </span>
        ))}
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} Sangeethan</span>
        <span>Designed &amp; built from a blueprint — Next.js · GSAP · Lenis · Matter.js</span>
      </div>
    </footer>
  );
}
