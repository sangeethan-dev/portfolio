"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, MQ } from "@/lib/gsap";
import { setScrollLocked } from "@/lib/lenis/useLenis";
import { markPreloaderDone } from "@/lib/preloader";
import { spotlight, mantra } from "@/content/site";
import styles from "./Preloader.module.css";

const SEEN_KEY = "sg-preloaded";
const PHOTOS = spotlight.frames;

function readSeen() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {}
}

/*
 * ~3s intro on a pale sheet: a framed box draws itself between four "+"
 * marks, real practices flick through it like a contact sheet while the
 * counter runs to 100, ink fills the frame, and the frame opens up to
 * become the (ink) hero. Once per session; click to skip.
 */
export default function Preloader() {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;

    function finish() {
      root.style.display = "none";
      setScrollLocked(false);
      markPreloaderDone();
    }

    // skip on a repeat visit, on a section link ("/#pricing"), or reduced motion
    if (readSeen() || window.location.hash || window.matchMedia(MQ.reduced).matches) {
      finish();
      return;
    }

    setScrollLocked(true);
    window.scrollTo(0, 0);

    const q = gsap.utils.selector(root);
    const frame = frameRef.current;
    const photos = q("[data-photo]");
    const counter = { v: 0 };
    const step = 0.16;

    gsap.set(photos, { autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete() {
        writeSeen();
        finish();
      },
    });

    tl.from(q("[data-cross]"), { scale: 0, rotate: -90, duration: 0.6, ease: "expo.out", stagger: 0.05 })
      .from(q("[data-edge='h']"), { scaleX: 0, duration: 0.7, ease: "expo.inOut" }, 0.15)
      .from(q("[data-edge='v']"), { scaleY: 0, duration: 0.7, ease: "expo.inOut" }, 0.15)
      .from(q("[data-word]"), { yPercent: 110, duration: 0.7, ease: "expo.out", stagger: 0.08 }, 0.5)
      .to(
        counter,
        {
          v: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate() {
            countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0.2
      );

    // contact-sheet flicker: each photo holds for one step, the last one stays
    photos.forEach((p, i) => {
      const at = 0.55 + i * step;
      tl.set(p, { autoAlpha: 1 }, at);
      if (i > 0) tl.set(photos[i - 1], { autoAlpha: 0 }, at);
    });

    tl.fromTo(q("[data-fill]"), { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: "expo.inOut" }, 2.05)
      .to(q("[data-fade]"), { autoAlpha: 0, duration: 0.3 }, 2.35)
      // the frame opens up into the hero
      .to(frame, { width: "100vw", height: "100svh", duration: 0.95, ease: "expo.inOut" }, 2.45)
      .add(() => markPreloaderDone(), "-=0.5")
      .to(root, { autoAlpha: 0, duration: 0.25 });

    function skip() {
      tl.progress(1);
    }
    root.addEventListener("click", skip);

    return () => {
      root.removeEventListener("click", skip);
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.preloader} data-cursor="Skip" aria-hidden="true">
      <div ref={frameRef} className={styles.frame}>
        <i className={`${styles.edge} ${styles.top}`} data-edge="h" />
        <i className={`${styles.edge} ${styles.bottom}`} data-edge="h" />
        <i className={`${styles.edge} ${styles.left}`} data-edge="v" />
        <i className={`${styles.edge} ${styles.right}`} data-edge="v" />

        <div className={styles.photos}>
          {PHOTOS.map((p) => (
            <Image
              key={p.src}
              src={p.src}
              alt=""
              fill
              sizes="260px"
              loading="eager"
              className={styles.photo}
              data-photo
            />
          ))}
        </div>
        <span className={styles.fill} data-fill />

        <i className={`${styles.cross} ${styles.cTL}`} data-cross data-fade />
        <i className={`${styles.cross} ${styles.cTR}`} data-cross data-fade />
        <i className={`${styles.cross} ${styles.cBL}`} data-cross data-fade />
        <i className={`${styles.cross} ${styles.cBR}`} data-cross data-fade />

        <p className={styles.caption} data-fade>
          {mantra.words.map((w) => (
            <span key={w} className={styles.mask}>
              <span className={styles.captionWord} data-word>
                {w}
              </span>
            </span>
          ))}
        </p>
      </div>

      <span className={styles.count} data-fade>
        <span ref={countRef}>000</span>
      </span>
    </div>
  );
}
