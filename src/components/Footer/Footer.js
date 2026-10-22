"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useSectionNav, { sectionHref } from "@/lib/lenis/useSectionNav";
import { contact, pageLinks, signoff } from "@/content/site";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import GlyphField from "./GlyphField";
import styles from "./Footer.module.css";

/* The wordmark is my ASCII Glyph Field experiment */
const WORDMARK = "SANGEETHAN";

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
          <ArrowLink href={sectionHref("#contact", pathname)} onClick={(e) => go("#contact", e)}>
            Start a project
          </ArrowLink>
          <ArrowLink href={contact.whatsapp} target="_blank" rel="noopener noreferrer" arrow="out">
            Chat on WhatsApp
          </ArrowLink>
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
          {/* /agencies is shared directly, so only it links across */}
          {pathname.startsWith("/agencies") && <Link href="/">For small businesses →</Link>}
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

      <GlyphField word={WORDMARK} label="Sangeethan" />
    </footer>
  );
}
