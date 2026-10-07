"use client";

import { useRef } from "react";
import { gsap, SplitText, ScrollTrigger, useGSAP, MQ } from "./index";

/*
 * Masked rise on scroll. autoSplit re-splits on resize / font load so
 * lines always match the current layout.
 *   type:  "lines" | "words" | "chars"
 */
export default function useSplitReveal({
  type = "lines",
  start = "top 85%",
  stagger = 0.08,
  delay = 0,
} = {}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        let st;
        let played = false;
        const split = SplitText.create(el, {
          type: type === "lines" ? "lines" : `lines,${type}`,
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            const targets = self[type];
            if (st) st.kill();
            if (played) return; // already revealed — re-split stays visible
            gsap.set(targets, { yPercent: 115 });
            const tween = gsap.to(targets, {
              yPercent: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger,
              delay,
              paused: true,
              onStart: () => (played = true),
            });
            st = ScrollTrigger.create({
              trigger: el,
              start,
              once: true,
              onEnter: () => tween.play(),
            });
            return tween;
          },
        });
        return () => {
          if (st) st.kill();
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return ref;
}
