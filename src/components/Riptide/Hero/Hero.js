"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { clinic, hero } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import Button from "../ui/Button";
import padMasks from "../ui/padMasks";
import styles from "./Hero.module.css";

const ACCENT = "nothing’s";

export default function Hero() {
  const rootRef = useRef(null);
  const mediaRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [src, setSrc] = useState(null);
  const { open } = useBooking();

  const [before, after] = hero.headline.split(ACCENT);

  /* The poster paints first; the clip loads once the page is idle */
  useEffect(() => {
    const motion = window.matchMedia(MQ.motion).matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (!motion || saveData) return;
    const portrait = window.matchMedia("(max-aspect-ratio: 4/5)").matches;
    const pick = () => setSrc(portrait ? hero.video.portrait : hero.video.landscape);
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
    const cancel = window.cancelIdleCallback || clearTimeout;
    let id;
    const start = () => (id = idle(pick, { timeout: 1500 }));
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (id) cancel(id);
    };
  }, []);

  function onPlaying() {
    gsap.to(videoRef.current, { opacity: 1, duration: 1.4, ease: "power2.out" });
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(rootRef);
        let split;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.from(q(`.${styles.barTop}`), { scaleY: 0, duration: 1.2, ease: "power4.inOut" }, 0)
          .from(q(`.${styles.barBottom}`), { scaleY: 0, duration: 1.2, ease: "power4.inOut" }, 0)
          .from(mediaRef.current, { scale: 1.18, duration: 2.8, ease: "power3.out" }, 0)
          .from(q(`.${styles.eyebrow}`), { y: 16, autoAlpha: 0, duration: 1 }, 0.5)
          .from(q(`.${styles.sub}`), { y: 22, autoAlpha: 0, duration: 1.1 }, 1.15)
          .from(q(`.${styles.actions} > *`), { y: 22, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 1.25)
          .from(q(`.${styles.strip} li, .${styles.cue}`), { y: 12, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, 1.4);

        // Its own tween (not part of tl): the font can land after tl has finished
        let wordsTween;
        const words = () => {
          split = SplitText.create(titleRef.current, { type: "words", mask: "words" });
          padMasks(split);
          gsap.set(titleRef.current, { autoAlpha: 1 });
          wordsTween = gsap.from(split.words, {
            yPercent: 115,
            rotate: 4,
            duration: 1.3,
            stagger: 0.075,
            ease: "expo.out",
            delay: Math.max(0, 0.55 - tl.time()),
          });
        };
        if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(words);
        else words();

        // As you scroll: the frame pushes in and the bars close
        const out = gsap.timeline({
          scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
        });
        out
          .to(mediaRef.current, { yPercent: 14, scale: 1.12, ease: "none" }, 0)
          .to(contentRef.current, { y: -90, autoAlpha: 0, ease: "none" }, 0)
          .to(q(`.${styles.barTop}, .${styles.barBottom}`), { height: "16vh", ease: "none" }, 0);


        return () => {
          if (wordsTween) wordsTween.kill();
          if (split) split.revert();
        };
      });

      mm.add(MQ.reduced, () => {
        gsap.set(titleRef.current, { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="top" className={styles.hero} aria-label="Welcome">
      <div ref={mediaRef} className={styles.media}>
        <picture>
          <source media="(max-aspect-ratio: 4/5)" srcSet={hero.poster.portrait} />
          <img
            src={hero.poster.landscape}
            alt="A runner on the beach at sunrise"
            className={styles.poster}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {src && (
          <video
            ref={videoRef}
            className={styles.video}
            src={src}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            onPlaying={onPlaying}
          />
        )}
        <div className={styles.scrim} />
      </div>

      <div className={styles.barTop} aria-hidden="true" />

      <div ref={contentRef} className={styles.content}>
        <p className={styles.eyebrow}>{hero.eyebrow}</p>
        <h1 ref={titleRef} className={styles.title}>
          {before}
          <em>{ACCENT}</em>
          {after}
        </h1>
        <p className={styles.sub}>{hero.sub}</p>
        <div className={styles.actions}>
          <Button size="lg" onClick={() => open({ type: "new" })}>
            {hero.primary}
          </Button>
          <Button size="lg" variant="ghost" icon={null} onClick={() => open({ type: "follow", returning: true })}>
            {hero.secondary}
          </Button>
        </div>
      </div>

      <div className={styles.barBottom}>
        <ul className={styles.strip}>
          <li className={styles.rating}>
            <span className={styles.stars} aria-hidden="true">
              ★★★★★
            </span>
            <strong>{clinic.rating.score}</strong> Google
            <span className={styles.count}>({clinic.rating.count} reviews)</span>
          </li>
          {hero.strip.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <span className={styles.cue} aria-hidden="true">
          Scroll <i />
        </span>
      </div>
    </section>
  );
}
