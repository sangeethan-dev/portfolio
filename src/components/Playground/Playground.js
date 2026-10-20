"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, Draggable, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { SCRAMBLE_CHARS } from "@/lib/gsap/useScramble";
import { lab, contact } from "@/content/site";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import LabFullscreen from "./LabFullscreen";
import styles from "./Playground.module.css";

const FRAME_W = 1280; // the width experiments are laid out at inside the scanner
const RUN_MQ = "(min-width: 1024px) and (pointer: fine)";

/* Where each card rests around the scanner (desktop), as % of the stage:
   two staggered columns either side, like trionn's team wall */
const HOME = [
  { left: 0.5, top: 2, r: -5 },
  { left: 14, top: 14, r: 4 },
  { left: 1.5, top: 36, r: 3 },
  { left: 15, top: 50, r: -4 },
  { left: 0.5, top: 70, r: -2 },
  { left: 13.5, top: 84, r: 5 },
  { left: 74, top: 3, r: 4 },
  { left: 86.5, top: 16, r: -5 },
  { left: 75, top: 40, r: -3 },
  { left: 87, top: 55, r: 4 },
  { left: 75.5, top: 76, r: -4 },
];

/*
 * The Lab — after trionn's "drag a member to identify" team scanner.
 * Screenshots of my experiments float around a scanner, wired to it with
 * hairlines. Drag one in (or click it) and the scanner identifies it:
 * a scan bar sweeps, the screenshot resolves from blur to sharp, and the
 * experiment's card slides up with a link to run it.
 *
 * On desktop the real experiment then runs live in the scanner, drawn at a
 * desktop width (FRAME_W) and scaled down to fit. It ignores the mouse
 * until you click it ("Interact"), so the page never gets stuck scrolling
 * over it; moving off the scanner hands control back. "Full screen" grows
 * it out to the whole viewport. Only one experiment runs at a time, and it
 * unloads when the Lab scrolls out of view.
 *
 * Phones/tablets: scanner on top, cards in a swipeable row underneath,
 * screenshot only (plus the link to open the experiment).
 */
/* Reused on /agencies with its own label and intro */
export default function Playground({ fig = "Fig. 06 — Lab", title = lab.title, intro = lab.intro }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const scannerRef = useRef(null);
  const statusRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const frameRef = useRef(null);
  const scanStartRef = useRef(0);
  const [active, setActive] = useState(null);
  const item = lab.items.find((i) => i.id === active);
  const index = lab.items.findIndex((i) => i.id === active);

  /* Live-run state. The ids are per experiment, so loading a different
     one resets them without an effect. */
  const [canRun, setCanRun] = useState(false); // desktop with a mouse
  const [autoRun, setAutoRun] = useState(false); // …and motion allowed
  const [inView, setInView] = useState(false);
  const [runId, setRunId] = useState(null); // asked to run (reduced motion)
  const [loadedId, setLoadedId] = useState(null);
  const [interactId, setInteractId] = useState(null);
  const [fullId, setFullId] = useState(null);

  const running = canRun && !!active && (autoRun || runId === active);
  const full = canRun && fullId === active && !!item;
  const showFrame = running && inView && !full;
  const loaded = showFrame && loadedId === active;
  const interacting = loaded && interactId === active;

  useEffect(() => {
    const run = window.matchMedia(RUN_MQ);
    const reduced = window.matchMedia(MQ.reduced);
    const sync = () => {
      setCanRun(run.matches);
      setAutoRun(run.matches && !reduced.matches);
    };
    sync();
    run.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      run.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  // unload the experiment while the Lab is off screen
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setLoadedId(null);
          setInteractId(null);
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  // keep the desktop-width frame scaled to the scanner
  useEffect(() => {
    if (!canRun) return;
    const scanner = scannerRef.current;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scanner.style.setProperty("--frame-scale", width / FRAME_W);
      scanner.style.setProperty("--frame-h", `${(height / width) * FRAME_W}px`);
    });
    ro.observe(scanner);
    return () => ro.disconnect();
  }, [canRun]);

  /* the frame fades in over the screenshot once it has loaded, but never
     before the scan has finished resolving */
  function onFrameLoad() {
    setLoadedId(active);
    const reduced = window.matchMedia(MQ.reduced).matches;
    const wait = Math.max(0, 1.6 - (performance.now() - scanStartRef.current) / 1000);
    gsap.to(frameRef.current, { autoAlpha: 1, duration: reduced ? 0 : 0.6, delay: reduced ? 0 : wait });
  }

  function showInfo(show) {
    const reduced = window.matchMedia(MQ.reduced).matches;
    gsap.to(scannerRef.current.querySelector("[data-info]"), {
      autoAlpha: show ? 1 : 0,
      y: show ? 0 : 24,
      duration: reduced ? 0 : show ? 0.6 : 0.35,
      ease: show ? "expo.out" : "power2.in",
      overwrite: true,
    });
  }

  function interact() {
    if (!loaded || interacting) return;
    setInteractId(active);
    showInfo(false);
    frameRef.current?.focus({ preventScroll: true });
  }

  const release = useCallback(() => {
    setInteractId(null);
    showInfo(true);
  }, []);

  // Esc / clicking anywhere else on the page hands control back
  useEffect(() => {
    if (!interacting) return;
    const onKey = (e) => e.key === "Escape" && release();
    const onDown = (e) => !scannerRef.current.contains(e.target) && release();
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [interacting, release]);

  function openFull() {
    setInteractId(null);
    setLoadedId(null); // the scanner's copy unloads while full screen runs
    setFullId(active);
  }

  function closeFull() {
    setFullId(null);
    gsap.set(scannerRef.current.querySelector("[data-info]"), { autoAlpha: 1, y: 0 });
  }

  const getOrigin = useCallback(() => scannerRef.current?.getBoundingClientRect(), []);

  /* ── Drag, float and the wires (desktop) ─────────────────────── */
  useGSAP(
    () => {
      const stage = stageRef.current;
      const scanner = scannerRef.current;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const cards = gsap.utils.toArray("[data-card]", stage);
        const lines = gsap.utils.toArray("[data-wire]", stage);
        const reduced = window.matchMedia(MQ.reduced).matches;

        cards.forEach((card, i) => gsap.set(card, { rotate: HOME[i].r }));

        function center(el) {
          const s = stage.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2 - s.left, y: r.top + r.height / 2 - s.top };
        }
        function wire() {
          const c = center(scanner);
          cards.forEach((card, i) => {
            const p = center(card);
            lines[i].setAttribute("x1", p.x);
            lines[i].setAttribute("y1", p.y);
            lines[i].setAttribute("x2", c.x);
            lines[i].setAttribute("y2", c.y);
          });
        }
        wire();
        gsap.ticker.add(wire);

        // idle float on the inner layer, so it never fights the drag
        const floats = reduced
          ? []
          : cards.map((card, i) =>
              gsap.to(card.querySelector("[data-float]"), {
                y: i % 2 ? 9 : -9,
                duration: 2.4 + i * 0.35,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
              })
            );

        function goHome(card, i) {
          gsap.to(card, {
            x: 0,
            y: 0,
            scale: 1,
            rotate: HOME[i].r,
            duration: reduced ? 0 : 1,
            ease: "elastic.out(1, 0.65)",
          });
        }

        // swallowed into the scanner, then back home once it's loaded
        function feed(card, i) {
          const s = center(scanner);
          const c = center(card);
          gsap.to(card, {
            x: `+=${s.x - c.x}`,
            y: `+=${s.y - c.y}`,
            scale: 0.4,
            rotate: 0,
            autoAlpha: 0,
            duration: reduced ? 0 : 0.45,
            ease: "power3.in",
            onComplete() {
              setActive(card.dataset.id);
              gsap.set(card, { x: 0, y: 0, scale: 1, rotate: HOME[i].r });
              gsap.to(card, { autoAlpha: 1, duration: 0.5, delay: 0.6 });
            },
          });
        }

        const drags = cards.map((card, i) =>
          Draggable.create(card, {
            type: "x,y",
            bounds: stage,
            zIndexBoost: true,
            onPress() {
              gsap.to(card, { scale: 1.06, rotate: 0, duration: 0.3, ease: "power3.out" });
            },
            onRelease() {
              if (this.hitTest(scanner, "25%")) feed(card, i);
              else goHome(card, i);
            },
            onClick() {
              feed(card, i);
            },
          })[0]
        );

        return () => {
          gsap.ticker.remove(wire);
          floats.forEach((t) => t.kill());
          drags.forEach((d) => d.kill());
          gsap.set(cards, { clearProps: "transform,opacity,visibility,zIndex" });
        };
      });

      // idle sweep across the empty scanner
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          scanner.querySelector("[data-idle-bar]"),
          { top: "-8%" },
          { top: "100%", duration: 3.2, ease: "power1.inOut", repeat: -1, repeatDelay: 0.6 }
        );
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* ── Scan sequence whenever a new experiment is loaded ───────── */
  useEffect(() => {
    if (!active) return;
    const scanner = scannerRef.current;
    const q = gsap.utils.selector(scanner);
    const reduced = window.matchMedia(MQ.reduced).matches;
    const tag = `Match · Exp. ${String(index + 1).padStart(2, "0")}`;
    scanStartRef.current = performance.now();

    if (reduced) {
      gsap.set(q("[data-shot]"), { autoAlpha: 1, filter: "none", scale: 1 });
      gsap.set(q("[data-info]"), { autoAlpha: 1, y: 0 });
      statusRef.current.textContent = tag;
      return;
    }

    const tl = gsap.timeline();
    tl.set(q("[data-info]"), { autoAlpha: 0, y: 24 })
      .set(q("[data-shot]"), { autoAlpha: 0, scale: 1.12, filter: "grayscale(1) blur(14px)" })
      .to(statusRef.current, { duration: 0.5, scrambleText: { text: "Identifying…", chars: SCRAMBLE_CHARS } }, 0)
      .fromTo(q("[data-scan-bar]"), { top: "-12%", autoAlpha: 1 }, { top: "100%", duration: 0.7, ease: "power1.inOut", repeat: 1 }, 0)
      .to(q("[data-shot]"), { autoAlpha: 1, duration: 0.3 }, 0.2)
      .to(q("[data-shot]"), { scale: 1, filter: "grayscale(0) blur(0px)", duration: 1.1, ease: "expo.out" }, 0.75)
      .to(q("[data-scan-bar]"), { autoAlpha: 0, duration: 0.2 }, 1.4)
      .to(statusRef.current, { duration: 0.6, scrambleText: { text: tag, chars: SCRAMBLE_CHARS } }, 1.3)
      .to(q("[data-info]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" }, 1.45);

    return () => tl.kill();
  }, [active, index]);

  return (
    <section id="playground" ref={rootRef} className={styles.section} data-theme-section="blueprint">
      <div className={`container ${styles.head}`}>
        <span className="label">{fig}</span>
        <h2 ref={titleRef} className={styles.title}>
          {title}
        </h2>
        <div className={styles.side}>
          <p className={styles.intro}>{intro}</p>
          <ArrowLink href={contact.inspirations} target="_blank" rel="noopener noreferrer" arrow="out">
            Explore the full library
          </ArrowLink>
        </div>
      </div>

      <div ref={stageRef} className={`container ${styles.stage}`}>
        <svg className={styles.wires} aria-hidden="true">
          {lab.items.map((it) => (
            <line key={it.id} data-wire className={it.id === active ? styles.wireOn : undefined} />
          ))}
        </svg>

        {/* ── The scanner ── */}
        <div
          ref={scannerRef}
          className={`${styles.scanner}${interacting ? ` ${styles.scannerLive}` : ""}`}
          data-cursor={loaded && !interacting ? "Interact" : "Drop"}
          onClick={(e) => {
            if (!e.target.closest("a, button")) interact();
          }}
          onMouseLeave={() => interacting && release()}
        >
          <i className={`${styles.bracket} ${styles.bTL}`} />
          <i className={`${styles.bracket} ${styles.bTR}`} />
          <i className={`${styles.bracket} ${styles.bBL}`} />
          <i className={`${styles.bracket} ${styles.bBR}`} />

          <p className={`${styles.status}${loaded ? ` ${styles.statusOn}` : ""}`}>
            <span>
              {interacting ? "Live · Interacting" : loaded ? "Live" : "Scanner"}
            </span>
            <span ref={statusRef} aria-live="polite" className={interacting ? styles.hidden : undefined}>
              {item ? `Match · Exp. ${String(index + 1).padStart(2, "0")}` : "Ready"}
            </span>
          </p>
          {interacting && (
            <ArrowLink onClick={release} className={`${styles.smallLink} ${styles.done}`}>
              Done
            </ArrowLink>
          )}

          {item ? (
            <>
              <div className={styles.shot} data-shot>
                <Image src={item.img} alt={`Screenshot of the ${item.title} experiment`} fill sizes="(max-width: 1023px) 92vw, 40vw" />
              </div>
              {showFrame && (
                <div className={styles.frameWrap}>
                  <iframe
                    key={active}
                    ref={frameRef}
                    src={item.run}
                    title={`${item.title} experiment, running live`}
                    sandbox="allow-scripts allow-same-origin"
                    referrerPolicy="no-referrer"
                    tabIndex={interacting ? 0 : -1}
                    className={styles.frame}
                    onLoad={onFrameLoad}
                  />
                </div>
              )}
              <i className={styles.scanBar} data-scan-bar aria-hidden="true" />
              <div className={styles.info} data-info>
                <div className={styles.infoMain}>
                  <span className={styles.infoCat}>{item.category}</span>
                  <h3 className={styles.infoTitle}>{item.title}</h3>
                  <p className={styles.infoDesc}>{item.desc}</p>
                  <ul className={styles.tech}>
                    {item.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.actions}>
                  {canRun && !running && (
                    <ArrowLink onClick={() => setRunId(active)} className={styles.run}>
                      Run it live
                    </ArrowLink>
                  )}
                  {loaded && (
                    <ArrowLink onClick={interact} className={styles.run}>
                      Interact
                    </ArrowLink>
                  )}
                  {canRun && (
                    <ArrowLink onClick={openFull} className={styles.run}>
                      Full screen
                    </ArrowLink>
                  )}
                  <ArrowLink
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    arrow="out"
                    className={styles.run}
                  >
                    Open experiment
                  </ArrowLink>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.empty}>
              <i className={styles.idleBar} data-idle-bar aria-hidden="true" />
              <span className={styles.cross} aria-hidden="true" />
              <p className={styles.emptyText}>
                <span className={styles.desktopOnly}>Drag an experiment here to run it</span>
                <span className={styles.touchOnly}>Tap an experiment to run it</span>
              </p>
            </div>
          )}
        </div>

        {/* ── The cards ── */}
        <ul className={styles.cards}>
          {lab.items.map((it, i) => (
            <li
              key={it.id}
              className={`${styles.card}${it.id === active ? ` ${styles.cardActive}` : ""}`}
              style={{ "--left": `${HOME[i].left}%`, "--top": `${HOME[i].top}%` }}
              data-card
              data-id={it.id}
            >
              <button
                type="button"
                className={styles.cardInner}
                data-float
                data-cursor="Drag"
                aria-label={`Run ${it.title} in the scanner`}
                onClick={(e) => {
                  // desktop clicks are handled by Draggable; this is touch + keyboard
                  if (!window.matchMedia("(min-width: 1024px)").matches || e.detail === 0) setActive(it.id);
                }}
              >
                <span className={styles.thumb}>
                  <Image src={it.img} alt="" fill sizes="220px" draggable={false} />
                </span>
                <span className={styles.cardCap}>
                  <span>Exp. {String(i + 1).padStart(2, "0")}</span>
                  <span>{it.title}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {full && <LabFullscreen item={item} index={index} getOrigin={getOrigin} onClose={closeFull} />}
    </section>
  );
}
