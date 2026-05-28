"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Process.module.css";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    title: "Discovery",
    desc: "A quick call to understand your goals, brand, and scope. No lengthy briefs required.",
  },
  {
    num: "02",
    title: "Proposal",
    desc: "Clear timeline, clear pricing, no surprises. No hidden costs, no vague deliverables.",
  },
  {
    num: "03",
    title: "Build",
    desc: "Focused sprints with regular progress shares. You always know where things stand.",
  },
  {
    num: "04",
    title: "Refine",
    desc: "Rounds of revisions until every pixel feels right before we go live.",
  },
  {
    num: "05",
    title: "Launch",
    desc: "Tested, optimised, deployed. Post-launch support included.",
  },
];

const headlineWords = [
  { text: "How" },
  { text: "I" },
  { text: "work.", em: true },
];

export default function Process() {
  const sectionRef    = useRef(null);
  const labelRef      = useRef(null);
  const wordRefs      = useRef([]);
  const countRef      = useRef(null);
  const trackOuterRef = useRef(null);
  const trackRef      = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const words = wordRefs.current.filter(Boolean);
    const track      = trackRef.current;
    const trackOuter = trackOuterRef.current;

    gsap.set(labelRef.current, { opacity: 0, y: 20 });
    gsap.set(words,            { opacity: 0.15 });
    gsap.set(countRef.current, { opacity: 0 });

    /* ── Header entrance ─────────────────────────────────────── */
    const headerST = ScrollTrigger.create({
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
        gsap.to(countRef.current, {
          opacity:  1,
          duration: 0.6,
          delay:    0.6,
        });
      },
    });

    if (isMobile) {
      return () => headerST.kill();
    }

    /* ── Desktop: pin + slide track left ────────────────────────
     * trackOuter = full viewport width (overflow:hidden)
     * track has padding-inline: var(--container-px) so it is
     * self-aligned; scrollWidth already includes that padding.
     * Scroll dist = scrollWidth − outerWidth brings the last
     * card's right edge exactly to outerRight − containerPx. ── */
    const dist = () => track.scrollWidth - trackOuter.offsetWidth;

    const tl = gsap.timeline();
    tl.to(track, { x: () => -dist(), ease: "none" });

    const pinST = ScrollTrigger.create({
      trigger:       sectionRef.current,
      pin:           true,
      start:         "top top",
      end:           () => `+=${dist()}`,
      scrub:         1,
      anticipatePin: 1,
      animation:     tl,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const idx = Math.min(
          Math.floor(self.progress * steps.length),
          steps.length - 1
        );
        setActiveIdx(idx);
      },
    });

    return () => {
      headerST.kill();
      pinST.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="process" className={styles.section}>

      {/* Header stays inside container */}
      <div className="container">
        <div className={styles.header}>
          <div>
            <span ref={labelRef} className={styles.label}>Process</span>
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
          <span ref={countRef} className={styles.count}>
            {String(activeIdx + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Track is a DIRECT child of the full-width outer — no .container
          wrapper. It carries its own padding-inline matching --container-px
          so the left-align is correct and the scroll-distance formula holds. */}
      <div ref={trackOuterRef} className={styles.trackOuter}>
        <div ref={trackRef} className={styles.track}>
          {steps.map((step) => (
            <div key={step.num} className={styles.card}>
              <div className={styles.cardShimmer} />
              <div className={styles.cardNum}>{step.num}</div>
              <p className={styles.cardTitle}>{step.title}</p>
              <p className={styles.cardDesc}>{step.desc}</p>
              <div className={styles.cardLine} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls back inside container */}
      <div className="container">
        <div className={styles.controls}>
          <span className={styles.hint}>Scroll to explore</span>
          <div className={styles.pips}>
            {steps.map((_, i) => (
              <div
                key={i}
                className={`${styles.pip}${i === activeIdx ? ` ${styles.pipActive}` : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
