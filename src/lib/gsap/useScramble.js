"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "./index";

export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_";

/*
 * Scrambles the element's text when its closest link/button (or itself)
 * is hovered or focused. The original text is always restored.
 */
export default function useScramble({ duration = 0.6 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(MQ.reduced).matches) return;

    const original = el.textContent;
    const host = el.closest("a, button") || el;

    function play() {
      gsap.to(el, {
        duration,
        scrambleText: { text: original, chars: SCRAMBLE_CHARS, speed: 0.6 },
        overwrite: true,
      });
    }

    host.addEventListener("mouseenter", play);
    host.addEventListener("focus", play);
    return () => {
      host.removeEventListener("mouseenter", play);
      host.removeEventListener("focus", play);
      gsap.killTweensOf(el);
      el.textContent = original;
    };
  }, [duration]);

  return ref;
}
