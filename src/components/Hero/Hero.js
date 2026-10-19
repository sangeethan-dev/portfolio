"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/preloader";
import { scrollToSection } from "@/lib/lenis/useLenis";
import { offer, aud, stats, spotlight } from "@/content/site";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import BlueprintGrid from "./BlueprintGrid";
import styles from "./Hero.module.css";

/* Photos that roll through the reel inside the headline */
const REEL = [0, 1, 3, 4, 5, 7].map((i) => spotlight.frames[i]);
const HOLD_MS = 0.45; // how long a press takes to switch to the blueprint

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
 * Hero. Words come into focus (blur → sharp), the photo pills open up
 * inside the headline, then the reel keeps rolling through real practices.
 *
 * Press and hold anywhere (or use the button) to see the blueprint behind
 * the page: the type turns to outlines, images become wireframe boxes and
 * the build notes appear. Let go and it builds itself back.
 */
export default function Hero() {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const reelRef = useRef(null);
  const ringRef = useRef(null);
  const guideXRef = useRef(null);
  const guideYRef = useRef(null);
  const [xray, setXray] = useState(false);
  const xrayRef = useRef(false);

  /* ── Ruler guides that follow the pointer ────────────────────── */
  useEffect(() => {
    if (!window.matchMedia(MQ.finePointer).matches) return;
    const root = rootRef.current;
    const gx = guideXRef.current;
    const gy = guideYRef.current;
    const yTo = gsap.quickTo(gx, "y", { duration: 0.25, ease: "power3.out" });
    const xTo = gsap.quickTo(gy, "x", { duration: 0.25, ease: "power3.out" });

    function onMove(e) {
      const r = root.getBoundingClientRect();
      yTo(e.clientY - r.top);
      xTo(e.clientX - r.left);
      gsap.to([gx, gy], { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
    }
    function onLeave() {
      gsap.to([gx, gy], { autoAlpha: 0, duration: 0.3, overwrite: "auto" });
    }
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* ── Intro, photo reel, scroll-out ───────────────────────────── */
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
        gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 20 });

        const intro = gsap
          .timeline({ paused: true })
          .to(words, {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.07,
          })
          .to(pills, { width: (i, el) => el.dataset.w, duration: 1.2, ease: "expo.inOut", stagger: 0.15 }, 0.35)
          .to(q("[data-hero-fade]"), { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }, 0.8)
          // pills lose their fixed width so they scale with the type again
          .add(() => gsap.set(pills, { clearProps: "width" }));

        // Reel: one frame every 1.8s, slot-machine style; the last child is a
        // copy of the first so the loop is seamless
        const reel = gsap.timeline({ repeat: -1, paused: true });
        for (let i = 1; i < frames; i++) {
          reel.to(reelRef.current, { yPercent: (-100 * i) / frames, duration: 0.9, ease: "expo.inOut" }, `+=${i === 1 ? 1.2 : 0.9}`);
        }
        reel.set(reelRef.current, { yPercent: 0 });

        const off = onPreloaderDone(() => {
          intro.play();
          gsap.delayedCall(1.6, () => reel.play());
        });

        // Scroll-out: content drifts up and dims as the next section takes over
        gsap.to(innerRef.current, {
          yPercent: -10,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
        });

        return () => {
          off();
          reel.kill();
        };
      });

      mm.add(MQ.reduced, () => {
        gsap.set(q("[data-hero-fade]"), { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* ── Blueprint x-ray: one CSS variable (--xray 0 → 1) drives it all ── */
  function setBlueprint(on) {
    if (xrayRef.current === on) return;
    xrayRef.current = on;
    setXray(on);
    const reduced = window.matchMedia(MQ.reduced).matches;
    gsap.to(rootRef.current, {
      "--xray": on ? 1 : 0,
      duration: reduced ? 0 : on ? 0.7 : 0.9,
      ease: on ? "expo.out" : "expo.inOut",
      overwrite: true,
    });
  }

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    let start = null;
    let fill = null;

    function cancelFill() {
      if (fill) fill.kill();
      fill = null;
      gsap.to(ring, { drawSVG: "0%", duration: 0.3, ease: "power2.out", overwrite: true });
    }

    function onDown(e) {
      if (e.button !== 0 || e.target.closest("a, button, input")) return;
      start = { x: e.clientX, y: e.clientY };
      fill = gsap.fromTo(
        ring,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: HOLD_MS, ease: "none", onComplete: () => setBlueprint(true) }
      );
    }
    function onMove(e) {
      // a drag (or a scroll on touch) is not a hold
      if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10 && !xrayRef.current) {
        start = null;
        cancelFill();
      }
    }
    function onUp() {
      if (!start && !xrayRef.current) return;
      start = null;
      cancelFill();
      setBlueprint(false);
    }

    gsap.set(ring, { drawSVG: "0%" });
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <section id="top" ref={rootRef} className={styles.hero} data-theme-section="blueprint">
      <BlueprintGrid className={styles.grid} />
      <span ref={guideXRef} className={styles.guideX} aria-hidden="true" />
      <span ref={guideYRef} className={styles.guideY} aria-hidden="true" />

      {/* registration marks on the sheet's corners */}
      <i className={`${styles.mark} ${styles.mTL}`} aria-hidden="true" />
      <i className={`${styles.mark} ${styles.mTR}`} aria-hidden="true" />
      <i className={`${styles.mark} ${styles.mBL}`} aria-hidden="true" />
      <i className={`${styles.mark} ${styles.mBR}`} aria-hidden="true" />

      <div ref={innerRef} className={`container ${styles.inner}`}>
        <div className={styles.topRow} data-hero-fade>
          <span className="label">Fig. 01 — Index</span>
          <span className="label">
            <i className={styles.liveDot} /> Available for projects · AU
          </span>
        </div>

        <h1 className={styles.headline}>
          <span className={styles.note} aria-hidden="true">
            &lt;h1&gt; Familjen Grotesk 500 · 9.6vw
          </span>

          <span className={styles.line}>
            <Words text="I" />{" "}
            <span className={`${styles.pill} ${styles.face}`} data-pill data-w="0.78em">
              <Image src="/portfolio/profile-headshot.webp" alt="" width={180} height={180} priority />
              <span className={styles.wire} aria-hidden="true">
                <span>img 1:1</span>
              </span>
            </span>{" "}
            <Words text="build websites" />
          </span>

          <span className={styles.line}>
            <Words text="that get" />{" "}
            <span className={`${styles.pill} ${styles.reelPill}`} data-pill data-w="1.9em">
              <span ref={reelRef} className={styles.reel}>
                {[...REEL, REEL[0]].map((f, i) => (
                  <span key={i} className={styles.frame}>
                    <Image src={f.src} alt="" fill sizes="(max-width: 767px) 30vw, 360px" priority={i < 2} />
                  </span>
                ))}
              </span>
              <span className={styles.wire} aria-hidden="true">
                <span>img reel × {REEL.length} · 2:1</span>
              </span>
            </span>
          </span>

          <span className={styles.line}>
            <Words text="you" /> <Words text="booked." className={styles.accent} />
          </span>
        </h1>

        <div className={styles.bottom}>
          <div className={`${styles.ctas} ${styles.box}`} data-hero-fade>
            <span className={styles.boxTag} aria-hidden="true">
              &lt;a&gt; × 2
            </span>
            <ArrowLink
              href="#build"
              arrow="down"
              data-cursor="Scroll"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#build", 0);
              }}
            >
              Watch it build
            </ArrowLink>
            <ArrowLink
              href="#pricing"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#pricing", 0);
              }}
            >
              {`Websites ${aud(offer.website)}`}
            </ArrowLink>
          </div>

          <button
            type="button"
            className={styles.hold}
            aria-pressed={xray}
            onClick={(e) => {
              // pointer holds are handled above; this is the keyboard path
              if (e.detail === 0) setBlueprint(!xrayRef.current);
            }}
            data-hero-fade
          >
            <svg viewBox="0 0 24 24" className={styles.ring} aria-hidden="true">
              <circle cx="12" cy="12" r="10" className={styles.ringTrack} />
              <circle ref={ringRef} cx="12" cy="12" r="10" className={styles.ringFill} />
            </svg>
            <span className={styles.holdText}>
              {xray ? "Release to build it back" : "Hold to see the blueprint"}
            </span>
          </button>

          <div className={`${styles.side} ${styles.box}`} data-hero-fade>
            <span className={styles.boxTag} aria-hidden="true">
              &lt;aside&gt;
            </span>
            <div className={styles.plate}>
              <span className={styles.plateNum}>
                {stats[0].value}
                <small>yrs</small>
              </span>
              <span className={styles.plateText}>Building websites people find, trust &amp; book.</span>
            </div>
            <p className={styles.sideNote}>
              For local practices and small businesses. Found on Google, trusted at first glance, booked in a
              couple of taps.
            </p>
          </div>
        </div>
      </div>

      <div className={`container ${styles.foot}`} data-hero-fade>
        <span className="label">Scroll to watch it build</span>
        <span className={styles.footRule} />
        <span className="label">Colombo → Australia · UTC+5:30</span>
      </div>
    </section>
  );
}
