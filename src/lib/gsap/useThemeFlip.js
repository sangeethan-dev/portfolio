"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "./index";
import { setTheme } from "./theme";

/*
 * Watches every element with data-theme-section="blueprint|live" and
 * switches the global theme when it arrives.
 *
 *   data-theme-start  ScrollTrigger start for the switch (default "top 50%").
 *                     e.g. "top 20%" waits until the section above has
 *                     almost fully scrolled away before switching.
 *
 * Scrolling back up past the start restores the theme of the section right
 * before it (when that section declares one), so the switch happens at the
 * same boundary in both directions.
 *
 * Mount once, after the page's sections, so pins above are measured first.
 */
export default function useThemeFlip() {
  useEffect(() => {
    const sections = document.querySelectorAll("[data-theme-section]");
    const triggers = Array.from(sections).map((el) => {
      const theme = el.dataset.themeSection;
      const prev = el.previousElementSibling;
      const prevTheme = prev && prev.dataset.themeSection;

      return ScrollTrigger.create({
        trigger: el,
        start: el.dataset.themeStart || "top 50%",
        end: "bottom 50%",
        onEnter: () => setTheme(theme),
        onEnterBack: () => setTheme(theme),
        onLeaveBack: () => {
          if (prevTheme) setTheme(prevTheme);
        },
      });
    });

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
