"use client";

import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import padMasks from "./padMasks";

/*
 * Big headings that rise in word by word as they scroll into view.
 * scrub: tie the reveal to scroll position instead of playing once.
 * Reduced motion: the heading is simply there.
 */
export default function useWordReveal(ref, { scrub = false, start = "top 82%", delay = 0 } = {}) {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let split;
        let tween;
        const build = () => {
          split = SplitText.create(el, { type: "words", mask: "words", wordsClass: "rt-word" });
          padMasks(split);
          tween = gsap.from(split.words, {
            yPercent: 112,
            rotate: 3,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.07,
            delay,
            scrollTrigger: scrub
              ? { trigger: el, start, end: "bottom 45%", scrub: 0.8 }
              : { trigger: el, start, once: true },
          });
        };
        // Split after the webfont is in so word widths are right
        if (document.fonts && document.fonts.status !== "loaded") {
          document.fonts.ready.then(build);
        } else {
          build();
        }
        return () => {
          if (tween) {
            tween.scrollTrigger?.kill();
            tween.kill();
          }
          if (split) split.revert();
        };
      });
      return () => mm.revert();
    },
    { dependencies: [] }
  );
}
