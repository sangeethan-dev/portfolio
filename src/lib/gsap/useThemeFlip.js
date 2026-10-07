"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "./index";
import { setTheme } from "./theme";

/*
 * Watches every element with data-theme-section="blueprint|live" and
 * switches the global theme while it holds the middle of the viewport.
 * Mount once, after the page's sections, so pins above are measured first.
 */
export default function useThemeFlip() {
  useEffect(() => {
    const sections = document.querySelectorAll("[data-theme-section]");
    const triggers = Array.from(sections).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle(self) {
          if (self.isActive) setTheme(el.dataset.themeSection);
        },
      })
    );

    // Webfonts change layout heights — re-measure once they're ready
    let cancelled = false;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      triggers.forEach((t) => t.kill());
    };
  }, []);
}
