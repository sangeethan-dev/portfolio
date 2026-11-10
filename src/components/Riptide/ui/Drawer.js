"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { setScrollLocked } from "@/lib/lenis/useLenis";
import styles from "./Drawer.module.css";

/*
 * Side panel on desktop, bottom sheet on phones. Stays mounted so GSAP can
 * play it in and out; `inert` keeps it out of the tab order while closed.
 */
export default function Drawer({ open, onClose, label, children, wide = false }) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const shadeRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const shade = shadeRef.current;
    const reduced = window.matchMedia(MQ.reduced).matches;
    const phone = window.matchMedia("(max-width: 767px)").matches;
    const d = reduced ? 0 : 0.55;

    if (open) {
      lastFocus.current = document.activeElement;
      root.inert = false;
      setScrollLocked(true);
      gsap.set(root, { visibility: "visible" });
      gsap.fromTo(shade, { opacity: 0 }, { opacity: 1, duration: d * 0.8, ease: "power2.out" });
      gsap.fromTo(
        panel,
        phone ? { yPercent: 100, xPercent: 0 } : { xPercent: 100, yPercent: 0 },
        { xPercent: 0, yPercent: 0, duration: d, ease: "expo.out" }
      );
      requestAnimationFrame(() => panel.focus({ preventScroll: true }));
    } else if (root.style.visibility === "visible") {
      root.inert = true;
      setScrollLocked(false);
      gsap.to(shade, { opacity: 0, duration: d * 0.6, ease: "power2.in" });
      gsap.to(panel, {
        ...(phone ? { yPercent: 100 } : { xPercent: 100 }),
        duration: d * 0.7,
        ease: "power3.in",
        onComplete: () => gsap.set(root, { visibility: "hidden" }),
      });
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    rootRef.current.inert = true;
    return () => setScrollLocked(false);
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={shadeRef} className={styles.shade} onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        className={`${styles.panel} ${wide ? styles.wide : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-lenis-prevent
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
            <path d="M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
