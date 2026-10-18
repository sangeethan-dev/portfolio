"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, MQ } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useSectionNav, { sectionHref } from "@/lib/lenis/useSectionNav";
import { contact, pageLinks, signoff } from "@/content/site";
import styles from "./Footer.module.css";

const WORD = "SANGEETHAN";

function timeIn(zone) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export default function Footer() {
  const rootRef = useRef(null);
  const wordRef = useRef(null);
  const myTimeRef = useRef(null);
  const auTimeRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const pathname = usePathname();
  const go = useSectionNav();

  /* Live clocks: my time → yours */
  useEffect(() => {
    function tick() {
      myTimeRef.current.textContent = timeIn(contact.timeZone);
      auTimeRef.current.textContent = timeIn(contact.clientTimeZone);
    }
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

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
        <div className={styles.lead}>
          <span className="label">{signoff.kicker}</span>
          <h2 ref={titleRef} className={styles.title}>
            {signoff.title}
          </h2>
        </div>

        <div className={styles.side}>
          <p className={`label ${styles.clock}`}>
            {contact.city} <span ref={myTimeRef}>--:--</span>
            <span aria-hidden="true">→</span>
            {contact.clientTimeLabel} <span ref={auTimeRef}>--:--</span>
          </p>
          <a
            href={sectionHref("#contact", pathname)}
            className={styles.cta}
            onClick={(e) => go("#contact", e)}
          >
            Start a project <span aria-hidden="true">→</span>
          </a>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className={styles.cta}>
            Chat on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className={`container ${styles.cols}`}>
        <div className={styles.col}>
          <span className={styles.colLabel}>Enquiries</span>
          <a href={`mailto:${contact.email}`}>E. {contact.email}</a>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
            W. {contact.phoneDisplay}
          </a>
        </div>
        <nav className={styles.col} aria-label="Footer">
          <span className={styles.colLabel}>Pages</span>
          {pathname.startsWith("/agencies") ? (
            <Link href="/">For small businesses →</Link>
          ) : (
            <Link href={pageLinks.agencies.href}>{pageLinks.agencies.label} →</Link>
          )}
          <Link href={pageLinks.privacy.href}>{pageLinks.privacy.label}</Link>
          <a href={contact.inspirations} target="_blank" rel="noopener noreferrer">
            Experiments ↗
          </a>
        </nav>
        <div className={`${styles.col} ${styles.colEnd}`}>
          <span className={styles.colLabel}>© {new Date().getFullYear()} Sangeethan</span>
          <a href="#top" onClick={(e) => go("#top", e)}>
            Back to top ↑
          </a>
        </div>
      </div>

      <div ref={wordRef} className={styles.word} aria-label={WORD} role="img">
        {WORD.split("").map((ch, i) => (
          <span key={i} className={styles.letter} data-letter aria-hidden="true">
            {ch}
          </span>
        ))}
      </div>
    </footer>
  );
}
