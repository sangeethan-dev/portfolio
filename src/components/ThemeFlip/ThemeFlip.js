"use client";

import useThemeFlip from "@/lib/gsap/useThemeFlip";

/* Mount after the page's sections so their pins are measured first. */
export default function ThemeFlip() {
  useThemeFlip();
  return null;
}
