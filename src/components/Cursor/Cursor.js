"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import styles from "./Cursor.module.css";

/*
 * Blueprint mode: a crosshair with a live x/y readout.
 * Live mode:      a solid dot.
 * Hovering anything with data-cursor="Label" swells into a labelled pill;
 * plain links/buttons get a softer grow.
 */
export default function Cursor() {
  const rootRef = useRef(null);
  const coordsRef = useRef(null);
  const blobRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia(MQ.finePointer).matches) return;

    const root = rootRef.current;
    const coords = coordsRef.current;
    const blob = blobRef.current;
    const label = labelRef.current;

    const xTo = gsap.quickTo(root, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.18, ease: "power3.out" });

    let shown = false;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    let currentTarget = null;

    function writeCoords() {
      raf = 0;
      coords.textContent = `x:${String(Math.round(lastX)).padStart(4, "0")} y:${String(
        Math.round(lastY)
      ).padStart(4, "0")}`;
    }

    function onMove(e) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!shown) {
        shown = true;
        gsap.set(root, { x: lastX, y: lastY });
        gsap.to(root, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(lastX);
      yTo(lastY);
      if (!raf) raf = requestAnimationFrame(writeCoords);
    }

    function setState(target) {
      if (target === currentTarget) return;
      currentTarget = target;
      const text = target ? target.getAttribute("data-cursor") : "";

      if (target && text) {
        label.textContent = text;
        root.dataset.state = "label";
        gsap.to(blob, { scale: 1, duration: 0.45, ease: "expo.out", overwrite: true });
        gsap.fromTo(label, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, overwrite: true });
      } else if (target) {
        root.dataset.state = "hover";
        gsap.to(blob, { scale: 0.45, duration: 0.4, ease: "expo.out", overwrite: true });
        gsap.to(label, { autoAlpha: 0, duration: 0.15, overwrite: true });
      } else {
        root.dataset.state = "idle";
        gsap.to(blob, { scale: 0.18, duration: 0.4, ease: "expo.out", overwrite: true });
        gsap.to(label, { autoAlpha: 0, duration: 0.15, overwrite: true });
      }
    }

    function onOver(e) {
      const t = e.target.closest("[data-cursor], a, button, label, input, select, textarea");
      setState(t);
    }

    function onDown() {
      gsap.to(blob, { scale: "-=0.08", duration: 0.12, yoyo: true, repeat: 1 });
    }

    function onLeaveDoc() {
      shown = false;
      gsap.to(root, { autoAlpha: 0, duration: 0.2 });
    }

    gsap.set(blob, { scale: 0.18 });
    root.dataset.state = "idle";

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerdown", onDown);
    document.documentElement.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeaveDoc);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.cursor} aria-hidden="true">
      <span className={styles.cross}>
        <i className={styles.h} />
        <i className={styles.v} />
      </span>
      <span ref={coordsRef} className={styles.coords}>
        x:0000 y:0000
      </span>
      <span ref={blobRef} className={styles.blob}>
        <span ref={labelRef} className={styles.label} />
      </span>
    </div>
  );
}
