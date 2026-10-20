"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, MQ } from "@/lib/gsap";
import { setScrollLocked } from "@/lib/lenis/useLenis";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import styles from "./Playground.module.css";

/* clip-path that crops the viewport down to a rect */
function insetOf(r) {
  if (!r) return "inset(0px 0px 0px 0px)";
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px)`;
}

/*
 * Full-screen run of one experiment. It grows out of the scanner (a
 * clip-path from the scanner's rect to the whole viewport) and shrinks
 * back into it on close. Rendered on <body> so no transformed ancestor
 * can trap the fixed layer. Page scroll is locked while it's open.
 */
export default function LabFullscreen({ item, index, getOrigin, onClose }) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const closingRef = useRef(false);

  function close() {
    if (closingRef.current) return;
    closingRef.current = true;
    const reduced = window.matchMedia(MQ.reduced).matches;
    gsap.to(rootRef.current, {
      clipPath: insetOf(getOrigin()),
      duration: reduced ? 0 : 0.7,
      ease: "expo.inOut",
      onComplete: onClose,
    });
  }

  useEffect(() => {
    const root = rootRef.current;
    const reduced = window.matchMedia(MQ.reduced).matches;
    const opener = document.activeElement;
    setScrollLocked(true);

    gsap.fromTo(
      root,
      { clipPath: insetOf(getOrigin()) },
      { clipPath: "inset(0px 0px 0px 0px)", duration: reduced ? 0 : 0.9, ease: "expo.inOut" }
    );
    root.querySelector("[data-close]")?.focus({ preventScroll: true });

    // Esc only reaches us while focus is outside the experiment
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      setScrollLocked(false);
      gsap.killTweensOf(root);
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <div
      ref={rootRef}
      className={styles.full}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, running full screen`}
    >
      <div className={styles.fullBar}>
        <p className={styles.fullTitle}>
          <span>Exp. {String(index + 1).padStart(2, "0")}</span>
          <span>{item.title}</span>
        </p>
        <div className={styles.fullActions}>
          <ArrowLink href={item.href} target="_blank" rel="noopener noreferrer" arrow="out" className={styles.smallLink}>
            Open in a new tab
          </ArrowLink>
          <ArrowLink onClick={close} className={styles.smallLink} data-close>
            Close
          </ArrowLink>
        </div>
      </div>
      <div className={styles.fullStage}>
        <iframe
          ref={frameRef}
          src={item.run}
          title={`${item.title} experiment`}
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          className={styles.fullFrame}
          onLoad={() => gsap.to(frameRef.current, { autoAlpha: 1, duration: 0.5 })}
        />
      </div>
    </div>,
    document.body
  );
}
