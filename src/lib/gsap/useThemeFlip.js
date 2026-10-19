"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "./index";
import { setTheme, setThemeResolver, syncTheme } from "./theme";

/*
 * Keeps the global theme in step with what's on screen.
 *
 *   data-theme-section="blueprint|live"  on page sections
 *   data-theme-start="top 20%"           optional: switch to this section only
 *                                        once its top reaches 20% of the
 *                                        viewport (default 50%)
 *   data-tone="blueprint|live"           on smaller areas inside a section
 *                                        (e.g. the Work rooms, which also
 *                                        slide in sideways); wins while it
 *                                        covers the middle of the screen
 *
 * One scroll listener resolves the theme from positions every update, rather
 * than one callback per section — so a fast jump across many sections (a nav
 * link, a deep link) always lands on the right theme, whatever order the
 * callbacks would have fired in.
 *
 * Mount once, after the page's sections, so pins above are measured first.
 */
function startLine(el) {
  const m = /top\s+(\d+(?:\.\d+)?)%/.exec(el.dataset.themeStart || "");
  return m ? Number(m[1]) / 100 : 0.5;
}

export default function useThemeFlip() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-theme-section]"));
    const tones = Array.from(document.querySelectorAll("[data-tone]"));

    function resolve() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const tone = tones.find((el) => {
        const r = el.getBoundingClientRect();
        return r.left <= vw / 2 && r.right > vw / 2 && r.top <= vh / 2 && r.bottom > vh / 2;
      });
      if (tone) return tone.dataset.tone;

      // the last section (in page order) whose top has crossed its start line
      let theme = sections[0] && sections[0].dataset.themeSection;
      sections.forEach((el) => {
        if (el.getBoundingClientRect().top <= vh * startLine(el)) theme = el.dataset.themeSection;
      });
      return theme;
    }

    // Arriving from another page can leave the previous page's theme on
    const first = resolve();
    if (first) setTheme(first, { immediate: true });

    setThemeResolver(resolve);
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: syncTheme, onRefresh: syncTheme });

    // Webfonts, pins and late-mounting sections change layout heights after
    // mount — re-measure once things settle, and whenever the page grows.
    let cancelled = false;
    let timer = 0;
    let lastH = document.documentElement.scrollHeight;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (cancelled) return;
        lastH = document.documentElement.scrollHeight;
        ScrollTrigger.refresh();
      }, 150);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    const ro = new ResizeObserver(() => {
      if (Math.abs(document.documentElement.scrollHeight - lastH) > 2) refresh();
    });
    ro.observe(document.body);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      ro.disconnect();
      window.removeEventListener("load", refresh);
      st.kill();
      setThemeResolver(null);
    };
  }, []);
}
