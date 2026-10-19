"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSectionNav from "@/lib/lenis/useSectionNav";
import { agency, lab, stats } from "@/content/site";
import BlueprintGrid from "../Hero/BlueprintGrid";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import styles from "./AgencyHero.module.css";

/* Experiment previews that roll through the reel in the headline */
const REEL = ["liquid-reveal-hero", "scroll-reveal-grid", "morph-loader", "magnetic-cards", "ascii-glyph-field"]
  .map((id) => lab.items.find((i) => i.id === id))
  .filter(Boolean);

function Words({ text, className = "" }) {
  return text.split(" ").map((w, i, all) => (
    <span key={i}>
      <span className={`${styles.word} ${className}`} data-word>
        {w}
      </span>
      {i < all.length - 1 && " "}
    </span>
  ));
}

/*
 * /agencies hero — same language as the homepage hero: words come into focus
 * (blur → sharp), photo pills open up inside the type, and a reel rolls
 * through recent work. No preloader on this page, so it plays on mount.
 */
export default function AgencyHero() {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const reelRef = useRef(null);
  const go = useSectionNav();

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const words = q("[data-word]");
        const pills = q("[data-pill]");
        const frames = reelRef.current.children.length;

        gsap.set(words, { yPercent: 40, opacity: 0, filter: "blur(14px)" });
        gsap.set(pills, { width: 0 });
        gsap.set(q("[data-ah-fade]"), { autoAlpha: 0, y: 20 });

        gsap
          .timeline({ delay: 0.15 })
          .to(words, { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.3, ease: "expo.out", stagger: 0.07 })
          .to(pills, { width: (i, el) => el.dataset.w, duration: 1.2, ease: "expo.inOut", stagger: 0.15 }, 0.35)
          .to(q("[data-ah-fade]"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }, 0.8)
          .add(() => gsap.set(pills, { clearProps: "width" }));

        const reel = gsap.timeline({ repeat: -1, delay: 1.8 });
        for (let i = 1; i < frames; i++) {
          reel.to(reelRef.current, { yPercent: (-100 * i) / frames, duration: 0.9, ease: "expo.inOut" }, `+=${i === 1 ? 1.2 : 0.9}`);
        }
        reel.set(reelRef.current, { yPercent: 0 });

        gsap.to(innerRef.current, {
          yPercent: -10,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => reel.kill();
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="top" ref={rootRef} className={styles.hero} data-theme-section="blueprint">
      <BlueprintGrid className={styles.grid} />
      <i className={`${styles.mark} ${styles.mTL}`} aria-hidden="true" />
      <i className={`${styles.mark} ${styles.mTR}`} aria-hidden="true" />
      <i className={`${styles.mark} ${styles.mBL}`} aria-hidden="true" />
      <i className={`${styles.mark} ${styles.mBR}`} aria-hidden="true" />

      <div ref={innerRef} className={`container ${styles.inner}`}>
        <div className={styles.topRow} data-ah-fade>
          <span className="label">Fig. 01 — For agencies</span>
          <span className="label">
            <i className={styles.liveDot} /> White-label · Fixed quotes · AU
          </span>
        </div>

        <h1 className={styles.headline} aria-label={agency.hero.title}>
          <span className={styles.line} aria-hidden="true">
            <Words text="Your" />{" "}
            <span className={`${styles.pill} ${styles.face}`} data-pill data-w="0.78em">
              <Image src="/portfolio/profile-headshot.webp" alt="" width={180} height={180} priority />
            </span>{" "}
            <Words text="white-label" className={styles.accent} />
          </span>
          <span className={styles.line} aria-hidden="true">
            <span className={`${styles.pill} ${styles.reelPill}`} data-pill data-w="1.9em">
              <span
                ref={reelRef}
                className={styles.reel}
                style={{ height: `${(REEL.length + 1) * 100}%` }}
              >
                {[...REEL, REEL[0]].map((f, i) => (
                  <span key={i} className={styles.frame}>
                    <Image src={f.img} alt="" fill sizes="(max-width: 767px) 30vw, 360px" priority={i < 2} />
                  </span>
                ))}
              </span>
            </span>{" "}
            <Words text="web developer." />
          </span>
        </h1>

        <div className={styles.bottom}>
          <div className={styles.ctas} data-ah-fade>
            <ArrowLink href="#contact" onClick={(e) => go("#contact", e)}>
              Brief me on a project
            </ArrowLink>
            <ArrowLink href="#rates" onClick={(e) => go("#rates", e)} arrow="down">
              See rates
            </ArrowLink>
          </div>

          <div className={styles.side} data-ah-fade>
            <div className={styles.plate}>
              <span className={styles.plateNum}>
                {stats[1].value}
                <small>{stats[1].suffix}</small>
              </span>
              <span className={styles.plateText}>
                Projects in {stats[0].value} years. Changes ready by your next morning.
              </span>
            </div>
            <p className={styles.sub}>{agency.hero.sub}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
