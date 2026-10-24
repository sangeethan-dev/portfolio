"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { SCRAMBLE_CHARS } from "@/lib/gsap/useScramble";
import { agency } from "@/content/site";
import styles from "./Agencies.module.css";

/* device widths as % of the stage, sized so each screenshot fills its frame */
const SIZES = [
  { key: "desktop", w: 100, px: 1440 },
  { key: "tablet", w: 47, px: 768 },
  { key: "phone", w: 29, px: 390 },
];

/*
 * "Send me the design" — after trionn's services page: the visual stays
 * pinned (sticky) while the points scroll past, and it acts out whichever
 * point is active. A browser frame on a staging link:
 *   01 resizes desktop → tablet → phone (real screenshots at each size)
 *   02 gets redlines and a token panel (fonts, colours, spacing)
 *   03 wipes from the greyscale design file to the colour build
 *   04 starts as a blank wireframe that draws itself, then is designed in
 * Loops pause while the section is off screen. Reduced motion: each point
 * shows its end state, no loops.
 */
export default function AgencyHandover() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const { title, intro, files, shots, url, points } = agency.handover;

  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      const q = gsap.utils.selector(root);
      const reduced = window.matchMedia(MQ.reduced).matches;
      const device = q("[data-device]")[0];
      const shot = Object.fromEntries(SIZES.map((s) => [s.key, q(`[data-shot="${s.key}"]`)[0]]));
      const layers = ["redlines", "tokens", "design", "wire"].map((k) => q(`[data-layer="${k}"]`)[0]);
      const [redlines, tokens, design, wire] = layers;
      const caption = q("[data-caption]")[0];
      const sizeOut = q("[data-size]")[0];
      const steps = q("[data-step]");
      let loop = null;
      let current = -1;

      const inView = ScrollTrigger.create({
        trigger: q("[data-ho-layout]")[0],
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loop && loop.paused(!self.isActive),
      });

      // the timeline each point plays; null = nothing beyond the reset
      const scenes = [
        // 01 every screen size
        () => {
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
          [SIZES[1], SIZES[2], SIZES[0]].forEach((s) => {
            tl.to(device, { width: `${s.w}%`, duration: 0.9, ease: "expo.inOut" }, "+=1.1")
              .to(SIZES.filter((o) => o !== s).map((o) => shot[o.key]), { autoAlpha: 0, duration: 0.3 }, "<0.35")
              .to(shot[s.key], { autoAlpha: 1, duration: 0.3 }, "<")
              .call(() => (sizeOut.textContent = s.px), null, "<");
          });
          return tl;
        },
        // 02 your system: redlines + tokens, once
        () =>
          gsap
            .timeline()
            .set(redlines, { autoAlpha: 1 })
            .fromTo(q('[data-layer="redlines"] > *'), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.18 })
            .fromTo(tokens, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" }, "<0.1")
            .fromTo(q("[data-token]"), { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.2 }, "<0.2"),
        // 03 design → build wipe, back and forth
        () =>
          gsap
            .timeline({ repeat: -1 })
            .set(design, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" })
            .to(design, { clipPath: "inset(0% 0% 0% 100%)", duration: 1.4, ease: "expo.inOut" }, "+=0.9")
            .to(design, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, "+=1.6"),
        // 04 wireframe draws itself, then the design pours in over it
        () =>
          gsap
            .timeline({ repeat: -1, repeatDelay: 1.4 })
            .set(wire, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" })
            .fromTo(q('[data-layer="wire"] i'), { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out", stagger: 0.07 })
            .to(wire, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.2, ease: "expo.inOut" }, "+=0.8"),
      ];

      // end states for reduced motion
      const still = [
        () => {},
        () => gsap.set([redlines, tokens, ...q('[data-layer="redlines"] > *'), ...q("[data-token]")], { autoAlpha: 1 }),
        () => gsap.set(design, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 50%)" }),
        () => gsap.set(wire, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 50%)" }),
      ];

      const show = contextSafe((i) => {
        if (i === current) return;
        current = i;
        loop?.kill();
        loop = null;
        const d = reduced ? 0 : 1;

        gsap.to(steps, { opacity: (k) => (k === i ? 1 : 0.25), duration: 0.4 * d, overwrite: true });
        // back to the plain desktop build before the next scene
        gsap.to(device, { width: "100%", duration: 0.6 * d, ease: "expo.inOut", overwrite: true });
        gsap.to([shot.tablet, shot.phone], { autoAlpha: 0, duration: 0.3 * d, overwrite: true });
        gsap.to(shot.desktop, { autoAlpha: 1, duration: 0.3 * d, overwrite: true });
        gsap.to(layers, { autoAlpha: 0, duration: 0.3 * d, overwrite: true });
        sizeOut.textContent = "1440";
        if (reduced) caption.textContent = points[i].caption;
        else gsap.to(caption, { duration: 0.6, scrambleText: { text: points[i].caption, chars: SCRAMBLE_CHARS }, overwrite: true });

        if (reduced) {
          gsap.delayedCall(0, still[i]);
          return;
        }
        gsap.delayedCall(0.65, () => {
          if (current !== i) return;
          loop = scenes[i]();
          if (!inView.isActive) loop.pause();
        });
      });

      gsap.set(steps, { opacity: 0.25 });
      steps.forEach((step, i) =>
        ScrollTrigger.create({
          trigger: step,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && show(i),
        })
      );
      show(0);

      return () => loop?.kill();
    },
    { scope: rootRef }
  );

  return (
    <section id="handover" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 05 — Handover</span>
        <h2 ref={titleRef} className={styles.title}>
          {title}
        </h2>
        <div className={styles.intro}>
          <p>{intro}</p>
          <ul className={styles.hoFiles} aria-label="Design files I work from">
            {files.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.hoLayout}`} data-ho-layout>
        <div className={styles.hoStick} aria-hidden="true">
          <div className={styles.hoStage}>
            <div className={styles.hoDevice} data-device>
              <div className={styles.hoBar}>
                <span className={styles.hoDots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.hoUrl}>{url}</span>
                <span className={styles.hoSize}>
                  <span data-size>1440</span>px
                </span>
              </div>

              <div className={styles.hoScreen}>
                {SIZES.map((s) => (
                  <Image
                    key={s.key}
                    src={shots[s.key]}
                    alt=""
                    fill
                    sizes="(max-width: 1023px) 92vw, 55vw"
                    className={styles.hoShot}
                    data-shot={s.key}
                  />
                ))}

                {/* 02: redlines over the build */}
                <div className={styles.hoLayer} data-layer="redlines">
                  <span className={`${styles.redline} ${styles.redW}`}>
                    <b>1280</b>
                  </span>
                  <span className={`${styles.redline} ${styles.redH}`}>
                    <b>96</b>
                  </span>
                  <span className={styles.hoSpec}>Display · 72 / −4%</span>
                </div>

                {/* 03: the design file, greyscale on a grid */}
                <div className={styles.hoLayer} data-layer="design">
                  <Image src={shots.desktop} alt="" fill sizes="(max-width: 1023px) 92vw, 55vw" className={`${styles.hoShot} ${styles.hoImgDesign}`} />
                  <span className={styles.hoGrid} />
                </div>

                {/* 04: a blank wireframe of the same page */}
                <div className={`${styles.hoLayer} ${styles.hoWire}`} data-layer="wire">
                  <svg className={styles.hoWireX} viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="100" />
                    <line x1="100" y1="0" x2="0" y2="100" />
                  </svg>
                  <i style={{ top: "6%", left: "3%", width: "14%" }} />
                  <i style={{ top: "6%", left: "70%", width: "27%" }} />
                  <i style={{ top: "26%", left: "3%", width: "26%" }} />
                  <i className={styles.hoWireBig} style={{ top: "33%", left: "3%", width: "42%" }} />
                  <i className={styles.hoWireBig} style={{ top: "45%", left: "3%", width: "36%" }} />
                  <i style={{ top: "61%", left: "3%", width: "24%" }} />
                  <i style={{ top: "65%", left: "3%", width: "22%" }} />
                  <i className={styles.hoWireBtn} style={{ top: "73%", left: "3%", width: "15%" }} />
                </div>
              </div>
            </div>

            {/* 02: the token panel, beside the frame */}
            <div className={styles.hoTokens} data-layer="tokens">
              <p className={styles.hoToken} data-token>
                <span>Type</span>
                <b className={styles.hoAa}>Aa</b>
              </p>
              <p className={styles.hoToken} data-token>
                <span>Colour</span>
                <b className={styles.hoSwatches}>
                  <i />
                  <i />
                  <i />
                </b>
              </p>
              <p className={styles.hoToken} data-token>
                <span>Spacing</span>
                <b className={styles.hoSpacing}>8 · 16 · 24 · 48</b>
              </p>
            </div>
          </div>
          <p className={styles.hoCaption} data-caption>
            {points[0].caption}
          </p>
        </div>

        <ol className={styles.hoSteps}>
          {points.map((p, i) => (
            <li key={p.title} className={styles.hoStep} data-step>
              <span className={styles.hoStepNum}>
                {String(i + 1).padStart(2, "0")} / {String(points.length).padStart(2, "0")}
              </span>
              <h3 className={styles.hoStepTitle}>{p.title}</h3>
              <p className={styles.hoStepDesc}>{p.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
