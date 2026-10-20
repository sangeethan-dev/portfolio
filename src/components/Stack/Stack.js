"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { SCRAMBLE_CHARS } from "@/lib/gsap/useScramble";
import { stack } from "@/content/site";
import styles from "./Stack.module.css";

/*
 * The stack, as big typographic rows — one per job (build, motion, CMS…).
 * Hover / focus / tap a tool: the rest of its row steps back, it turns
 * ember, and the row's note scrambles into what I use it for. Tools marked
 * with a dot are running on this page right now.
 */
export default function Stack({ fig = "Fig. 07 — Stack" }) {
  const rootRef = useRef(null);
  const noteRefs = useRef([]);
  const titleRef = useSplitReveal({ type: "lines" });
  const [active, setActive] = useState(null); // { g, t } or null

  /* Rows: hairline draws across, then the names rise out of their masks */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const triggers = gsap.utils.toArray("[data-group]", rootRef.current).map((group) => {
          // paused timeline + plain trigger (a timeline-owned `once` trigger
          // can crash ScrollTrigger's refresh in GSAP 3.13)
          const tl = gsap
            .timeline({ paused: true })
            .from(group.querySelector("[data-rule]"), { scaleX: 0, duration: 1, ease: "expo.inOut" })
            .from(group.querySelectorAll("[data-head]"), { autoAlpha: 0, y: 16, duration: 0.7, ease: "expo.out" }, 0.2)
            .from(group.querySelectorAll("[data-tool]"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.05 }, 0.25)
            .from(group.querySelector("[data-note]"), { autoAlpha: 0, duration: 0.6 }, 0.6);
          return ScrollTrigger.create({ trigger: group, start: "top 85%", once: true, onEnter: () => tl.play() });
        });
        return () => triggers.forEach((t) => t.kill());
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* Each row's note shows the active tool's note, or the row's blurb */
  useEffect(() => {
    const reduced = window.matchMedia(MQ.reduced).matches;
    stack.groups.forEach((group, g) => {
      const el = noteRefs.current[g];
      if (!el) return;
      const tool = active && active.g === g ? group.tools[active.t] : null;
      const text = tool ? `${tool.name} — ${tool.note}` : group.blurb;
      if (el.dataset.text === text) return;
      el.dataset.text = text;
      if (reduced) {
        el.textContent = text;
      } else {
        gsap.to(el, { duration: 0.5, scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.9 }, overwrite: true });
      }
    });
  }, [active]);

  return (
    <section id="stack" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">{fig}</span>
        <h2 ref={titleRef} className={styles.title}>
          {stack.title}
        </h2>
        <div className={styles.side}>
          <p className={styles.intro}>{stack.intro}</p>
          <p className={styles.legend}>
            <i className={styles.dot} aria-hidden="true" /> Running on this page
          </p>
        </div>
      </div>

      <div className="container">
        {stack.groups.map((group, g) => (
          <div
            key={group.id}
            className={styles.group}
            data-group
            data-active={active && active.g === g ? "true" : undefined}
            onMouseLeave={() => setActive((a) => (a && a.g === g ? null : a))}
          >
            <i className={styles.rule} data-rule aria-hidden="true" />

            <div className={styles.groupHead} data-head>
              <span className={styles.num}>{String(g + 1).padStart(2, "0")}</span>
              <h3 className={styles.groupLabel}>{group.label}</h3>
              <span className={styles.count}>{String(group.tools.length).padStart(2, "0")} tools</span>
            </div>

            <div className={styles.body}>
              <ul className={styles.tools}>
                {group.tools.map((tool, t) => {
                  const on = active && active.g === g && active.t === t;
                  return (
                    <li key={tool.name} className={styles.mask}>
                      <button
                        type="button"
                        className={`${styles.tool}${on ? ` ${styles.toolOn}` : ""}`}
                        data-tool
                        aria-pressed={on}
                        onMouseEnter={() => setActive({ g, t })}
                        onFocus={() => setActive({ g, t })}
                        onClick={() => setActive(on ? null : { g, t })}
                      >
                        {tool.name}
                        {tool.live && (
                          <i className={styles.dot} aria-label="running on this page" role="img" />
                        )}
                      </button>
                      {t < group.tools.length - 1 && (
                        <span className={styles.slash} data-tool aria-hidden="true">
                          /
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p
                ref={(el) => (noteRefs.current[g] = el)}
                className={styles.note}
                data-note
                data-text={group.blurb}
                aria-live="polite"
              >
                {group.blurb}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
