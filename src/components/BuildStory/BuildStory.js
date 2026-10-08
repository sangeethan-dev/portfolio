"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import { setTheme } from "@/lib/gsap/theme";
import { SCRAMBLE_CHARS } from "@/lib/gsap/useScramble";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { buildSteps } from "@/content/site";
import styles from "./BuildStory.module.css";

/* Browser chrome per stage */
const URLS = ["wavelength/wireframe.fig", "wavelength/design-v2.fig", "localhost:3000", "wavelengthosteo.com.au"];
const BADGES = ["Wireframe", "Design", "Compiling", "Live"];

/* Syntax-tokenised code — [kind, text]; hl = index of the element it highlights */
const CODE = [
  { t: [["c", "// Hero.jsx — Wavelength Osteopathy"]] },
  { t: [["p", "<"], ["k", "section"], ["p", " className="], ["s", '"hero"'], ["p", ">"]] },
  { t: [["p", "  <"], ["k", "h1"], ["p", ">Feel better. Move freely.</"], ["k", "h1"], ["p", ">"]], hl: 0 },
  { t: [["p", "  <"], ["k", "Button"], ["p", " "], ["f", "magnetic"], ["p", ">Book online</"], ["k", "Button"], ["p", ">"]], hl: 1 },
  { t: [["p", "</"], ["k", "section"], ["p", ">"]] },
  { t: [] },
  { t: [["f", "gsap"], ["p", "."], ["f", "to"], ["p", "("], ["s", '".marquee"'], ["p", ", {"]], hl: 2 },
  { t: [["p", "  xPercent: "], ["k", "-50"], ["p", ", repeat: "], ["k", "-1"]] },
  { t: [["p", "});"]] },
];

const TOKEN_CLASS = { c: "tc", k: "tk", s: "ts", f: "tf", p: "tp" };

/* Stage boundaries on the master timeline (in timeline seconds) */
const STAGE_AT = [0, 1, 3, 5.4];

function Block({ className = "", label, hl, cross, children }) {
  return (
    <div className={`${styles.block} ${className}`}>
      <div className={styles.content} data-content>
        {children}
      </div>
      <span className={styles.wire} data-wire aria-hidden="true">
        {cross && (
          <svg className={styles.cross} viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" />
            <line x1="100" y1="0" x2="0" y2="100" />
          </svg>
        )}
        <span className={styles.wireLabel}>{label}</span>
      </span>
      {hl && (
        <span className={styles.hl} data-hl aria-hidden="true">
          <span className={styles.hlTag}>{hl}</span>
        </span>
      )}
    </div>
  );
}

export default function BuildStory() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const urlRef = useRef(null);
  const badgeRef = useRef(null);
  const countRef = useRef(null);
  const artRef = useRef(null);
  const trackRef = useRef(null);
  const siteBtnRef = useMagnetic(0.45);
  const [stage, setStage] = useState(0);
  const [reduced, setReduced] = useState(false);

  /* ── Caption crossfade when the stage changes ─────────────────── */
  useEffect(() => {
    const caps = rootRef.current.querySelectorAll("[data-caption]");
    if (reduced) {
      // static layout lists every step — drop any crossfade inline styles
      gsap.killTweensOf(caps);
      gsap.set(caps, { clearProps: "opacity,visibility,transform" });
      return;
    }
    caps.forEach((c, i) => {
      gsap.to(c, {
        autoAlpha: i === stage ? 1 : 0,
        y: i === stage ? 0 : i < stage ? -18 : 18,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
    });
  }, [stage, reduced]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const wires = q("[data-wire]");
      const contents = q("[data-content]");
      const hls = q("[data-hl]");
      const lines = q("[data-code-line]");
      const mm = gsap.matchMedia();

      /* Loops that run only once the site is "live" */
      const marquee = gsap.to(trackRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 14,
        ease: "none",
        paused: true,
      });
      const spin = gsap.to(artRef.current, {
        rotate: 360,
        repeat: -1,
        duration: 30,
        ease: "none",
        paused: true,
      });
      let counterId = 0;
      function startCounter() {
        if (counterId) return;
        counterId = window.setInterval(() => {
          const el = countRef.current;
          el.textContent = String(parseInt(el.textContent, 10) + 1);
          gsap.fromTo(el, { yPercent: -40, scale: 1.2 }, { yPercent: 0, scale: 1, duration: 0.5, ease: "back.out(3)" });
        }, 1800);
      }
      function stopCounter() {
        window.clearInterval(counterId);
        counterId = 0;
      }

      let current = -1;
      function applyStage(i) {
        if (i === current) return;
        current = i;
        setStage(i);
        gsap.to(urlRef.current, {
          duration: 0.5,
          scrambleText: { text: URLS[i], chars: SCRAMBLE_CHARS, speed: 0.7 },
          overwrite: true,
        });
        badgeRef.current.textContent = BADGES[i];
        badgeRef.current.dataset.live = i === 3 ? "true" : "false";
        setTheme(i === 3 ? "live" : "blueprint");
        if (i === 3) {
          marquee.play();
          spin.play();
          startCounter();
        } else {
          marquee.pause();
          spin.pause();
          stopCounter();
        }
      }

      mm.add(MQ.reduced, () => {
        setReduced(true);
        gsap.set(wires, { autoAlpha: 0 });
        gsap.set(contents, { autoAlpha: 1 });
        gsap.set(q("[data-screen-fill]"), { autoAlpha: 1 });
        urlRef.current.textContent = URLS[3];
        badgeRef.current.textContent = BADGES[3];
        badgeRef.current.dataset.live = "true";
      });

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { mobile } = ctx.conditions;

        /* initial: wireframe */
        gsap.set(contents, { autoAlpha: 0, y: 12 });
        gsap.set(wires, { autoAlpha: 1, scaleX: 0, transformOrigin: "left center" });
        gsap.set(q("[data-screen-fill]"), { autoAlpha: 0 });
        gsap.set(q("[data-swatch]"), { autoAlpha: 0, x: -30, scale: 0.6 });
        gsap.set(q("[data-editor]"), { autoAlpha: 0, x: mobile ? 0 : 60, y: mobile ? 40 : 0 });
        gsap.set(lines, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(hls, { autoAlpha: 0 });

        /* wireframe draws itself as the section arrives (not scrubbed) */
        const drawIn = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 75%",
          once: true,
          onEnter() {
            gsap.to(wires, { scaleX: 1, duration: 0.9, ease: "expo.out", stagger: 0.05 });
          },
        });

        /* master scrubbed timeline */
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        // 01 → 02 design
        tl.to(wires, { autoAlpha: 0, duration: 0.6, stagger: 0.03 }, STAGE_AT[1])
          .to(q("[data-screen-fill]"), { autoAlpha: 1, duration: 0.7 }, STAGE_AT[1])
          .to(contents, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" }, STAGE_AT[1] + 0.2)
          .to(q("[data-swatch]"), { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, stagger: 0.06, ease: "back.out(2)" }, STAGE_AT[1] + 0.3);

        // 02 → 03 code
        tl.to(q("[data-swatch]"), { autoAlpha: 0, x: -20, duration: 0.4, stagger: 0.03 }, STAGE_AT[2])
          .to(q("[data-editor]"), { autoAlpha: 1, x: 0, y: 0, duration: 0.6, ease: "power3.out" }, STAGE_AT[2]);
        let at = STAGE_AT[2] + 0.5;
        CODE.forEach((line, i) => {
          const len = Math.max(line.t.reduce((n, [, s]) => n + s.length, 0), 1);
          tl.to(lines[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: `steps(${Math.min(len, 40)})` }, at);
          if (typeof line.hl === "number") {
            tl.to(hls, { autoAlpha: 0, duration: 0.05 }, at).to(hls[line.hl], { autoAlpha: 1, duration: 0.1 }, at + 0.05);
          }
          at += 0.2;
        });

        // 03 → 04 live
        tl.to(q("[data-editor]"), { autoAlpha: 0, x: mobile ? 0 : 60, y: mobile ? 40 : 0, duration: 0.5 }, STAGE_AT[3])
          .to(hls, { autoAlpha: 0, duration: 0.3 }, STAGE_AT[3])
          .fromTo(q("[data-frame]"), { scale: 1 }, { scale: 1.025, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" }, STAGE_AT[3] + 0.2)
          .to({}, { duration: 1.2 }); // hold on the live site

        tl.fromTo(q("[data-rail-fill]"), { scaleY: 0 }, { scaleY: 1, duration: tl.duration(), ease: "none" }, 0);

        // Read the stage from the timeline itself — with scrub smoothing the
        // playhead keeps moving after ScrollTrigger's last onUpdate.
        tl.eventCallback("onUpdate", () => {
          const t = tl.time();
          let i = 0;
          for (let s = 0; s < STAGE_AT.length; s++) if (t >= STAGE_AT[s] - 0.05) i = s;
          applyStage(i);
        });

        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          pin: pinRef.current,
          start: "top top",
          end: mobile ? "+=260%" : "+=380%",
          scrub: 0.8,
          anticipatePin: 1,
          animation: tl,
          invalidateOnRefresh: true,
        });

        return () => {
          drawIn.kill();
          st.kill();
        };
      });

      return () => {
        mm.revert();
        marquee.kill();
        spin.kill();
        stopCounter();
      };
    },
    { scope: rootRef }
  );

  return (
    <section id="build" ref={rootRef} className={`${styles.section}${reduced ? ` ${styles.static}` : ""}`}>
      <div ref={pinRef} className={styles.pin}>
        <div className={`container ${styles.layout}`}>
          {/* ── Captions ─────────────────────────────────────────── */}
          <aside className={styles.captions}>
            <span className="label">Fig. 02 — The build</span>

            <div className={styles.captionBody}>
              <div className={styles.rail} aria-hidden="true">
                <i className={styles.railFill} data-rail-fill />
                {buildSteps.map((s, i) => (
                  <span key={s.num} className={`${styles.tick}${i <= stage ? ` ${styles.tickOn}` : ""}`} />
                ))}
              </div>

              <div className={styles.captionStack}>
                {buildSteps.map((s) => (
                  <div key={s.num} className={styles.caption} data-caption>
                    <span className={styles.capNum}>{s.num}</span>
                    <h2 className={styles.capTitle}>{s.title}</h2>
                    <p className={styles.capDesc}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className={styles.capHint}>
              {reduced ? "How I work, from first sketch to launch." : "Keep scrolling and watch a real site come together."}
            </p>
          </aside>

          {/* ── Stage ────────────────────────────────────────────── */}
          <div className={styles.stage}>
            <div className={styles.swatches} aria-hidden="true">
              <span className={`${styles.swatch} ${styles.swInk}`} data-swatch />
              <span className={`${styles.swatch} ${styles.swAccent}`} data-swatch />
              <span className={`${styles.swatch} ${styles.swPetal}`} data-swatch />
              <span className={`${styles.swatch} ${styles.swLeaf}`} data-swatch />
              <span className={styles.typeChip} data-swatch>
                Aa <small>Unbounded / Inter</small>
              </span>
            </div>

            <div className={styles.frame} data-frame>
              <div className={styles.chrome}>
                <span className={styles.dots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span ref={urlRef} className={styles.url}>
                  {URLS[0]}
                </span>
                <span ref={badgeRef} className={styles.badge} data-live="false">
                  {BADGES[0]}
                </span>
              </div>

              <div className={styles.screen}>
                <span className={styles.screenFill} data-screen-fill />

                <div className={styles.site}>
                  <Block className={styles.bNav} label="nav">
                    <span className={styles.logo}>Wavelength</span>
                    <span className={styles.links}>
                      <span>Services</span>
                      <span>Team</span>
                      <span>Fees</span>
                    </span>
                    <span className={styles.navBtn}>Book</span>
                  </Block>

                  <div className={styles.heroRow}>
                    <div className={styles.heroText}>
                      <Block className={styles.bH1} label="h1" hl="<h1>">
                        <p className={styles.siteH1}>
                          Feel better. <em>Move</em> freely.
                        </p>
                      </Block>
                      <Block className={styles.bP} label="p">
                        <p className={styles.siteP}>
                          Osteopathy for back pain, sports injuries and everyday aches. Early and late appointments, six days a week.
                        </p>
                      </Block>
                      <div className={styles.ctaRow}>
                        <Block className={styles.bBtn} label="button" hl="<Button magnetic>">
                          <span ref={siteBtnRef} className={styles.siteBtn} data-cursor="Try me">
                            <span data-magnetic-inner>Book online →</span>
                          </span>
                        </Block>
                        <Block className={styles.bStat} label="stat">
                          <span ref={countRef} className={styles.statNum}>
                            128
                          </span>
                          <span className={styles.statLabel}>booked this week</span>
                        </Block>
                      </div>
                    </div>

                    <Block className={styles.bArt} label="img 4:5" cross>
                      <div className={styles.artBox}>
                        <div ref={artRef} className={styles.flower}>
                          {Array.from({ length: 8 }).map((_, i) => (
                            <span key={i} className={styles.petal} style={{ "--i": i }} />
                          ))}
                          <span className={styles.flowerCore} />
                        </div>
                        <span className={styles.leafA} />
                        <span className={styles.leafB} />
                      </div>
                    </Block>
                  </div>

                  <div className={styles.cards}>
                    {["Osteopathy", "Remedial massage", "Clinical Pilates"].map((c, i) => (
                      <Block key={c} className={styles.bCard} label="card">
                        <span className={styles.cardChip} style={{ "--c": i }} />
                        <span className={styles.cardTitle}>{c}</span>
                      </Block>
                    ))}
                  </div>

                  <Block className={styles.bMarquee} label="marquee" hl="gsap.to(marquee)">
                    <div className={styles.marquee}>
                      <div ref={trackRef} className={styles.track}>
                        {Array.from({ length: 2 }).map((_, k) => (
                          <span key={k} className={styles.trackItem}>
                            Book online 24/7 ✿ Health fund rebates on the spot ✿ No referral needed ✿ Book online 24/7 ✿ Health fund rebates on the spot ✿ No referral needed ✿&nbsp;
                          </span>
                        ))}
                      </div>
                    </div>
                  </Block>
                </div>
              </div>
            </div>

            <div className={styles.editor} data-editor aria-hidden="true">
              <div className={styles.editorTab}>
                <span>Hero.jsx</span>
                <span className={styles.editorDot} />
              </div>
              <pre className={styles.code}>
                {CODE.map((line, i) => (
                  <span key={i} className={styles.codeLine}>
                    <span className={styles.ln}>{String(i + 1).padStart(2, " ")}</span>
                    <span data-code-line className={styles.codeText}>
                      {line.t.map(([kind, text], j) => (
                        <span key={j} className={styles[TOKEN_CLASS[kind]]}>
                          {text}
                        </span>
                      ))}
                      {"​"}
                    </span>
                  </span>
                ))}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
