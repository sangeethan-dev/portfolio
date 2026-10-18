"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance = null;
let locked = false;

export function getLenis() {
  return lenisInstance;
}

/*
 * Lock / unlock scrolling. Safe to call before Lenis exists (child effects
 * run before the SmoothScroll parent's) — the flag is applied on creation.
 */
export function setScrollLocked(value) {
  locked = value;
  if (!lenisInstance) return;
  if (value) lenisInstance.stop();
  else lenisInstance.start();
}

/* Smooth-scroll to an in-page anchor ("#id"), clearing the fixed header */
export function scrollToSection(href, offset = -90) {
  const target = href === "#top" ? 0 : document.querySelector(href);
  if (target === null) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: target === 0 ? 0 : offset, duration: 1.4 });
  } else {
    const top =
      target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }
}

export default function useLenis() {
  useEffect(() => {
    // Tuned to match trionn.com: a short cubic ease-out per wheel step, a
    // slightly damped wheel (more so on Mac trackpads), and native-feeling
    // touch via syncTouch. duration + easing win over lerp in Lenis 1.3;
    // lerp only drives syncTouch.
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lerp: 0.105,
      orientation: "vertical",
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: isTouch || isMac ? 0.6 : 0.85,
      touchMultiplier: isTouch ? 1.2 : 1.1,
    });

    lenisInstance = lenis;
    if (locked) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisInstance = null;
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);
}
