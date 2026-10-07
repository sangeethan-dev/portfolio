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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
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
