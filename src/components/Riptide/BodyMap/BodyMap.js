"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { bodyMap } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import Button from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";
import useWordReveal from "../ui/useWordReveal";
import styles from "./BodyMap.module.css";

export default function BodyMap() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const panelRef = useRef(null);
  const markerRefs = useRef([]);
  const sceneRef = useRef(null);
  const [sel, setSel] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | ready | failed
  const { open } = useBooking();
  const region = bodyMap.regions.find((r) => r.id === sel);

  useWordReveal(titleRef);

  /* Three.js only loads when the section is close to the screen */
  useEffect(() => {
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          const { default: BodyScene } = await import("./BodyScene");
          if (cancelled) return;
          sceneRef.current = new BodyScene({
            canvas: canvasRef.current,
            wrap: wrapRef.current,
            regions: bodyMap.regions,
            markers: markerRefs.current,
            model: bodyMap.model,
            reduced: window.matchMedia(MQ.reduced).matches,
            onTap: (id) => setSel(id),
            onReady: () => setStatus("ready"),
            onFail: () => setStatus("failed"),
          });
        } catch (err) {
          setStatus("failed");
        }
      },
      { rootMargin: "50% 0px" }
    );
    io.observe(rootRef.current);
    return () => {
      cancelled = true;
      io.disconnect();
      if (sceneRef.current) sceneRef.current.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) sceneRef.current.select(sel);
  }, [sel]);

  /* Panel content slides when the selection changes */
  useGSAP(
    () => {
      if (!window.matchMedia(MQ.motion).matches || !panelRef.current) return;
      gsap.fromTo(
        panelRef.current.children,
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out", stagger: 0.05 }
      );
    },
    { dependencies: [sel], scope: rootRef }
  );

  /* Hotspot pulse */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          `.${styles.pulse}`,
          { scale: 0.6, opacity: 0.9 },
          { scale: 2.4, opacity: 0, duration: 1.8, ease: "power2.out", repeat: -1, stagger: { each: 0.3, from: "random" } }
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="where" className={styles.section} aria-labelledby="where-title">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <Eyebrow>Body map</Eyebrow>
          <h2 ref={titleRef} id="where-title" className={styles.title}>
            Where does it <em>hurt?</em>
          </h2>
          <p className={styles.intro}>{bodyMap.intro}</p>

          <div className={styles.chips} role="group" aria-label="Choose an area">
            {bodyMap.regions.map((r) => (
              <button
                key={r.id}
                type="button"
                aria-pressed={sel === r.id}
                className={`${styles.chip} ${sel === r.id ? styles.chipOn : ""}`}
                onClick={() => setSel(sel === r.id ? null : r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div ref={panelRef} className={styles.panel} aria-live="polite">
            {region ? (
              <>
                <p className={styles.kicker}>Common {region.label.toLowerCase()} problems</p>
                <ul className={styles.conditions}>
                  {region.conditions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <p className={styles.helpLabel}>How we help</p>
                <p className={styles.help}>{region.help}</p>
                <div className={styles.panelActions}>
                  <Button onClick={() => open({ type: "new", reason: `${region.label} pain` })}>Book for this</Button>
                  <Button variant="text" icon={null} onClick={() => setSel(null)}>
                    Pick another area
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.kicker}>Nothing selected yet</p>
                <p className={styles.help}>
                  Tap a glowing point on the body or pick an area above. Not sure what’s wrong? That’s exactly what the first
                  visit is for.
                </p>
                <div className={styles.panelActions}>
                  <Button variant="ghost" onClick={() => open({ type: "new" })}>
                    Book an initial consult
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        <div ref={wrapRef} className={`${styles.viewport} ${status === "ready" ? styles.ready : ""}`}>
          <div className={styles.glow} aria-hidden="true" />
          <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive 3D body. Drag to turn it, tap an area to learn more." role="img" />
          {bodyMap.regions.map((r, i) => (
            <button
              key={r.id}
              ref={(el) => (markerRefs.current[i] = el)}
              type="button"
              className={`${styles.marker} ${sel === r.id ? styles.markerOn : ""}`}
              onClick={() => setSel(sel === r.id ? null : r.id)}
              aria-label={`${r.label}: show common problems`}
              tabIndex={-1}
            >
              <span className={styles.pulse} aria-hidden="true" />
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.markerLabel}>{r.label}</span>
            </button>
          ))}
          <div className={styles.hud} aria-hidden="true">
            <span>{status === "failed" ? "Use the list to choose an area" : "Drag to turn · Tap where it hurts"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
