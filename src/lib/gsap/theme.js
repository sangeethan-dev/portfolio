"use client";

import { gsap } from "./index";

/*
 * Theme controller — tweens the semantic colour tokens on :root between
 * the --bp-* (blueprint) and --live-* (colour) sets in globals.css.
 * Mirrors the theme to <html data-theme> so CSS can switch modes
 * (e.g. the cursor's crosshair vs dot).
 */
const KEYS = ["bg", "surface", "fg", "fg-mute", "line", "accent", "accent-ink"];

let current = "blueprint";
const listeners = new Set();

function readSet(theme) {
  const prefix = theme === "live" ? "live" : "bp";
  const cs = getComputedStyle(document.documentElement);
  const out = {};
  KEYS.forEach((k) => {
    out[`--${k}`] = cs.getPropertyValue(`--${prefix}-${k}`).trim();
  });
  return out;
}

export function getTheme() {
  return current;
}

export function setTheme(theme, { immediate = false } = {}) {
  if (typeof document === "undefined" || theme === current) return;
  current = theme;
  const root = document.documentElement;
  root.dataset.theme = theme;
  gsap.to(root, {
    ...readSet(theme),
    duration: immediate ? 0 : 0.9,
    ease: "power2.inOut",
    overwrite: true,
  });
  listeners.forEach((fn) => fn(theme));
}

export function onThemeChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* useThemeFlip registers how to work out the theme from what's on screen;
   anything that moves sections without a scroll (e.g. a scrubbed slide
   catching up) can call syncTheme() to re-check. */
let resolver = null;

export function setThemeResolver(fn) {
  resolver = fn;
}

export function syncTheme() {
  const theme = resolver && resolver();
  if (theme) setTheme(theme);
}
