"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { onPreloaderDone } from "@/lib/preloader";
import { scrollToSection } from "@/lib/lenis/useLenis";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { offer, aud } from "@/content/site";
import BlueprintGrid from "./BlueprintGrid";
import styles from "./Hero.module.css";

export default function Hero() {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const headWrapRef = useRef(null);
  const h1Ref = useRef(null);
  const moveRef = useRef(null);
  const wRef = useRef(null);
  const hRef = useRef(null);
  const guideXRef = useRef(null);
  const guideYRef = useRef(null);
  const primaryRef = useMagnetic(0.4);

  /* ── Live dimension readout around the headline ──────────────── */
  useEffect(() => {
    const el = headWrapRef.current;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      wRef.current.textContent = `W ${Math.round(width)}px`;
      hRef.current.textContent = `H ${Math.round(height)}px`;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  /* ── Intro, hover physics, scroll-out ─────────────────────────── */
  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const lines = q(`.${styles.line}`);
      const split = SplitText.create(h1Ref.current, { type: "words,chars" });
      const chars = split.chars;
      const moveChars = chars.filter((c) => moveRef.current.contains(c));
      const mm = gsap.matchMedia();

      mm.add(MQ.reduced, () => {
        gsap.set(q("[data-hero-fade]"), { autoAlpha: 1 });
      });

      mm.add(MQ.motion, () => {
        gsap.set(chars, { yPercent: 115 });
        gsap.set(lines, { overflow: "hidden" });
        gsap.set(q("[data-dim-h]"), { scaleX: 0 });
        gsap.set(q("[data-dim-v]"), { scaleY: 0 });
        gsap.set(q("[data-hero-fade]"), { autoAlpha: 0, y: 20 });

        const intro = gsap.timeline({ paused: true });
        intro
          .to(chars, {
            yPercent: 0,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.022,
            onComplete: () => gsap.set(lines, { overflow: "visible" }),
          })
          .to(q("[data-dim-h]"), { scaleX: 1, duration: 0.9, ease: "expo.inOut" }, 0.55)
          .to(q("[data-dim-v]"), { scaleY: 1, duration: 0.9, ease: "expo.inOut" }, 0.65)
          .to(
            q("[data-hero-fade]"),
            { autoAlpha: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 },
            0.7
          );

        // "move." keeps moving — a wave every few seconds
        const wave = gsap.timeline({ repeat: -1, repeatDelay: 2.6, paused: true });
        wave.to(moveChars, {
          yPercent: -28,
          rotate: -6,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.06,
        }).to(
          moveChars,
          { yPercent: 0, rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", stagger: 0.06 },
          0.3
        );

        const off = onPreloaderDone(() => {
          intro.play();
          gsap.delayedCall(2, () => wave.play());
        });

        // Letters hop when the pointer touches them
        function hop(e) {
          const c = e.currentTarget;
          if (gsap.isTweening(c)) return;
          gsap
            .timeline()
            .to(c, { yPercent: -22, duration: 0.18, ease: "power2.out" })
            .to(c, { yPercent: 0, duration: 0.9, ease: "elastic.out(1, 0.3)" });
        }
        const hoppable = window.matchMedia(MQ.finePointer).matches
          ? chars.filter((c) => !moveRef.current.contains(c))
          : [];
        hoppable.forEach((c) => c.addEventListener("pointerenter", hop));

        // Scroll-out: content drifts up and dims as the build story takes over
        gsap.to(innerRef.current, {
          yPercent: -12,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => {
          off();
          hoppable.forEach((c) => c.removeEventListener("pointerenter", hop));
        };
      });

      return () => {
        mm.revert();
        split.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      id="top"
      ref={rootRef}
      className={styles.hero}
      data-theme-section="blueprint"
    >
      <BlueprintGrid className={styles.grid} />
      <span ref={guideXRef} className={styles.guideX} aria-hidden="true" />
      <span ref={guideYRef} className={styles.guideY} aria-hidden="true" />

      <div ref={innerRef} className={`container ${styles.inner}`}>
        <div className={styles.topRow} data-hero-fade>
          <span className="label">Fig. 01 — Index</span>
          <span className="label">
            <i className={styles.liveDot} /> Available for projects · AU
          </span>
        </div>

        <div ref={headWrapRef} className={styles.headWrap}>
          {/* measurement annotations */}
          <span className={styles.dimTop} aria-hidden="true">
            <i className={styles.dimLineH} data-dim-h />
            <span ref={wRef} className={styles.dimLabel} data-hero-fade>
              W 0px
            </span>
          </span>
          <span className={styles.dimSide} aria-hidden="true">
            <i className={styles.dimLineV} data-dim-v />
            <span ref={hRef} className={`${styles.dimLabel} ${styles.dimLabelV}`} data-hero-fade>
              H 0px
            </span>
          </span>
          <i className={`${styles.corner} ${styles.tl}`} data-hero-fade />
          <i className={`${styles.corner} ${styles.tr}`} data-hero-fade />
          <i className={`${styles.corner} ${styles.bl}`} data-hero-fade />
          <i className={`${styles.corner} ${styles.br}`} data-hero-fade />

          <h1 ref={h1Ref} className={styles.headline}>
            <span className={styles.line}>I design &amp;</span>
            <span className={`${styles.line} ${styles.outline}`}>build sites</span>
            <span className={styles.line}>
              that{" "}
              <span ref={moveRef} className={styles.move}>
                move.
              </span>
            </span>
          </h1>
        </div>

        <div className={styles.bottom}>
          <p className={styles.sub} data-hero-fade>
            Custom websites for local practices and small businesses —{" "}
            <strong>easy to find on Google, trusted at first glance, and booked
            in a couple of taps</strong>.
          </p>

          <div className={styles.ctas} data-hero-fade>
            <a
              ref={primaryRef}
              href="#build"
              className={styles.primary}
              data-cursor="Scroll"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#build", 0);
              }}
            >
              <span data-magnetic-inner>Watch it build ↓</span>
            </a>
            <a
              href="#pricing"
              className={styles.secondary}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#pricing", 0);
              }}
            >
              Intro offer: websites {aud(offer.website)} →
            </a>
          </div>
        </div>
      </div>

      <div className={`container ${styles.foot}`} data-hero-fade>
        <span className="label">Scroll to compile</span>
        <span className={styles.footRule} />
        <span className="label">Colombo → Australia · UTC+5:30</span>
      </div>
    </section>
  );
}
