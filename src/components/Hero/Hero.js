"use client";

import { useEffect, useRef, useState } from "react";
import Sticker from "@/components/Sticker/Sticker";
import styles from "./Hero.module.css";

/* ── Headline content — words split for clip-mask rise ──────────── */
const LINE_LOOK = [
  "Designers",
  "make",
  "it",
  { w: "look", accent: true },
  "right.",
];
const LINE_WORK = ["I", "make", "it", { w: "work", accent: true }, "right."];

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

export default function Hero() {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const labelARef = useRef(null);
  const labelBRef = useRef(null);

  const progressRef = useRef(0);
  const draggingRef = useRef(false);
  const interactedRef = useRef(false);
  const autoTimers = useRef([]);

  const [isLive, setIsLive] = useState(false);

  /* ── Apply progress → drives everything via the --p custom prop ── */
  function applyProgress(p) {
    const v = clamp01(p);
    progressRef.current = v;
    if (rootRef.current) rootRef.current.style.setProperty("--p", v);
    const live = v >= 0.5;
    setIsLive((prev) => (prev === live ? prev : live));
  }

  /* ── Toggle geometry (label positions feed the thumb via CSS) ──── */
  function measure() {
    const track = trackRef.current;
    const a = labelARef.current;
    const b = labelBRef.current;
    if (!track || !a || !b) return;
    const t = track.getBoundingClientRect();
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    track.style.setProperty("--a-left", ar.left - t.left + "px");
    track.style.setProperty("--a-width", ar.width + "px");
    track.style.setProperty("--b-left", br.left - t.left + "px");
    track.style.setProperty("--b-width", br.width + "px");
  }

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ── Auto-demo once (skipped under reduced motion / interaction) ── */
  function cancelAuto() {
    interactedRef.current = true;
    autoTimers.current.forEach(clearTimeout);
    autoTimers.current = [];
  }

  useEffect(() => {
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const t1 = setTimeout(() => {
      if (interactedRef.current) return;
      applyProgress(1);
      const t2 = setTimeout(() => {
        if (!interactedRef.current) applyProgress(0);
      }, 2200);
      autoTimers.current.push(t2);
    }, 2500);
    autoTimers.current.push(t1);

    return () => {
      autoTimers.current.forEach(clearTimeout);
      autoTimers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Pointer → progress mapping (centre-to-centre travel) ──────── */
  function progressFromX(clientX) {
    const track = trackRef.current;
    if (!track) return progressRef.current;
    const t = track.getBoundingClientRect();
    const aLeft = parseFloat(
      getComputedStyle(track).getPropertyValue("--a-left"),
    );
    const aWidth = parseFloat(
      getComputedStyle(track).getPropertyValue("--a-width"),
    );
    const bLeft = parseFloat(
      getComputedStyle(track).getPropertyValue("--b-left"),
    );
    const bWidth = parseFloat(
      getComputedStyle(track).getPropertyValue("--b-width"),
    );
    const aCenter = aLeft + aWidth / 2;
    const bCenter = bLeft + bWidth / 2;
    const x = clientX - t.left;
    return clamp01((x - aCenter) / (bCenter - aCenter));
  }

  function startDrag(e) {
    cancelAuto();
    draggingRef.current = true;
    rootRef.current.classList.add(styles.dragging);
    try {
      trackRef.current.setPointerCapture(e.pointerId);
    } catch {}
    applyProgress(progressFromX(e.clientX));
  }

  function onTrackPointerMove(e) {
    if (!draggingRef.current) return;
    applyProgress(progressFromX(e.clientX));
  }

  function endDrag(e) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    rootRef.current.classList.remove(styles.dragging);
    try {
      trackRef.current.releasePointerCapture(e.pointerId);
    } catch {}
    applyProgress(progressRef.current >= 0.5 ? 1 : 0); // snap
  }

  function animateTo(target) {
    cancelAuto();
    applyProgress(target);
  }

  function onKeyDown(e) {
    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        animateTo(progressRef.current >= 0.5 ? 0 : 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        animateTo(0);
        break;
      case "ArrowRight":
        e.preventDefault();
        animateTo(1);
        break;
      default:
        break;
    }
  }

  /* ── Stagger delay helper for the headline entrance ────────────── */
  let wordIndex = 0;
  const renderWord = (item, key) => {
    const delay = wordIndex * 0.08;
    wordIndex += 1;
    const isAccent = typeof item === "object";
    const text = isAccent ? item.w : item;
    return (
      <span className={styles.mask} key={key}>
        <span
          className={`${styles.word}${isAccent ? " serif-italic" : ""}`}
          style={{ animationDelay: `${delay}s` }}
        >
          {text}
        </span>
      </span>
    );
  };

  return (
    <section
      ref={rootRef}
      id="hero"
      className={styles.hero}
      style={{ "--p": 0 }}
    >
      <div className={`container ${styles.inner}`}>
        {/* ── Left column ─────────────────────────────────────── */}
        <div className={styles.left}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Creative Frontend Developer · Sri Lanka
          </p>

          <h1 className={styles.headline}>
            <span className={`${styles.line} ${styles.lnLook}`}>
              {LINE_LOOK.map((w, i) => renderWord(w, `look-${i}`))}
            </span>
            <span className={`${styles.line} ${styles.lnWork}`}>
              {LINE_WORK.map((w, i) => renderWord(w, `work-${i}`))}
            </span>
          </h1>

          <p className={styles.sub}>
            A designer hands me a static frame. I turn it into something that{" "}
            <strong>moves, responds, and ships</strong> — clean code, buttery
            motion, zero bloat. Drag the switch to watch it come alive.
          </p>

          {/* ── BuildToggle ───────────────────────────────────── */}
          <div className={styles.toggleRow}>
            <div
              ref={trackRef}
              className={styles.toggle}
              role="switch"
              aria-checked={isLive}
              aria-label="Toggle between the static design and the live build"
              tabIndex={0}
              onPointerDown={startDrag}
              onPointerMove={onTrackPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={onKeyDown}
            >
              <button
                ref={labelARef}
                type="button"
                className={`${styles.label} ${styles.labelA}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => animateTo(0)}
                tabIndex={-1}
              >
                The Design
              </button>
              <button
                ref={labelBRef}
                type="button"
                className={`${styles.label} ${styles.labelB}`}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => animateTo(1)}
                tabIndex={-1}
              >
                The Build
              </button>
              <span className={styles.thumb} aria-hidden="true" />
            </div>

            <span className={styles.toggleHint}>
              {/* <span className={styles.toggleHintArrow} aria-hidden="true">
                ⇆
              </span> */}
              Switch to compare
            </span>
          </div>
        </div>

        {/* ── Right column — DemoStage ────────────────────────── */}
        <div className={styles.stageCol}>
          <div className={styles.stageFrame}>
            <div
              className={`${styles.stage}${isLive ? ` ${styles.live}` : ""}`}
              aria-hidden="true"
            >
              <span className={styles.glow} />

              {/* Browser chrome */}
              <div className={styles.chrome}>
                <span className={styles.chromeDots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.chromeLabel}>
                  <span className={styles.chromeStatic}>
                    figma · static frame
                  </span>
                  <span className={styles.chromeLive}>▶ running · live</span>
                </span>
              </div>

              {/* Screen */}
              <div className={styles.screen}>
                <span className={styles.gridBg} />

                {/* Mock product card */}
                <div className={styles.card}>
                  <span className={styles.wash} />

                  <span className={styles.cardTag}>Featured</span>

                  <h3 className={styles.cardTitle}>
                    Built to{" "}
                    <span className={styles.cardAccent}>
                      perform
                      <span className={styles.underline} />
                    </span>
                  </h3>

                  <p className={styles.cardCopy}>
                    Motion that earns its place — fast, deliberate, on brand.
                  </p>

                  <span className={styles.cardBtn}>
                    Get started →
                    <span className={styles.shine} />
                  </span>

                  <span className={styles.circle} />
                </div>

                {/* Floating accent dots */}
                <span className={styles.floatDots}>
                  <i style={{ "--d": "0s" }} />
                  <i style={{ "--d": "0.4s" }} />
                  <i style={{ "--d": "0.8s" }} />
                </span>

                {/* Fake cursor + ripple */}
                <span className={styles.cursor}>
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <path
                      d="M5 3l14 7-6 2-2 6-6-15z"
                      fill="#1D1C1C"
                      stroke="#FFF48D"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className={styles.ripple} />
                </span>

                {/* FPS meter */}
                <span className={styles.meter}>
                  <span className={styles.meterBars}>
                    <i style={{ "--d": "0s" }} />
                    <i style={{ "--d": "0.15s" }} />
                    <i style={{ "--d": "0.3s" }} />
                    <i style={{ "--d": "0.45s" }} />
                  </span>
                  60 FPS · LIVE
                </span>
              </div>
            </div>

            {/* State stamp — sibling of .stage so it isn't clipped */}
            <span className={styles.stickerWrap}>
              {isLive ? (
                <Sticker variant="badge" rotate={4}>
                  IT MOVES
                </Sticker>
              ) : (
                <Sticker variant="badge" rotate={-4}>
                  LOOKS GOOD
                </Sticker>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ── Hero footer strip ─────────────────────────────────── */}
      <div className={`container ${styles.footer}`}>
        <span className={styles.footItem}>
          <span className={styles.footDot} /> Available for projects
        </span>
        {/* <span className={`${styles.footItem} ${styles.scrollCue}`}>
          Scroll to explore
          <span className={styles.scrollArrow} aria-hidden="true">
            ↓
          </span>
        </span> */}
      </div>
    </section>
  );
}
