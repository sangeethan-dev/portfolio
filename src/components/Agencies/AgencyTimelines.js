"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useSectionNav from "@/lib/lenis/useSectionNav";
import { agency } from "@/content/site";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import styles from "./Agencies.module.css";

const WEEKS = ["1 wk", "2 wks", "3 wks", "4 wks"];

/*
 * Typical turnarounds as bars on a four-week axis, so "overnight" and
 * "3–4 weeks" read at a glance. The solid part is the usual time, the
 * lighter part the upper end of the range. On scroll each bar grows for
 * as long as it is long: a fix snaps in, a website takes its time.
 */
export default function AgencyTimelines() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });
  const go = useSectionNav();
  const { title, intro, scale, items, note } = agency.timelines;
  const pct = (days) => `${Math.min(100, (days / scale) * 100)}%`;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = rootRef.current;
        const rows = gsap.utils.toArray("[data-tl-row]", root);
        const tl = gsap.timeline({ paused: true });

        gsap.set(root.querySelectorAll("[data-tl-rule]"), { scaleX: 0 });
        gsap.set(root.querySelectorAll("[data-tl-bar]"), { scaleX: 0 });
        gsap.set(root.querySelectorAll("[data-tl-text]"), { autoAlpha: 0, y: 16 });

        rows.forEach((row, i) => {
          const at = i * 0.18;
          const length = items[i].max / scale;
          tl.to(row.querySelector("[data-tl-rule]"), { scaleX: 1, duration: 0.9, ease: "expo.inOut" }, at)
            .to(row.querySelectorAll("[data-tl-text]"), { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 }, at + 0.15)
            .to(row.querySelector("[data-tl-bar]"), { scaleX: 1, duration: 0.25 + length * 1.4, ease: "power2.out" }, at + 0.35);
        });

        // paused timeline + its own trigger (a scrollTrigger on the timeline
        // itself trips a GSAP 3.13 bug when other triggers are created after it)
        const st = ScrollTrigger.create({
          trigger: root.querySelector("[data-tl-chart]"),
          start: "top 80%",
          once: true,
          onEnter: () => tl.play(),
        });
        return () => {
          st.kill();
          tl.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="timelines" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 06 — Timelines</span>
        <h2 ref={titleRef} className={styles.title}>
          {title}
        </h2>
        <p className={styles.intro}>{intro}</p>
      </div>

      <div className="container">
        <div className={styles.tlChart} data-tl-chart>
          <div className={`${styles.tlRow} ${styles.tlAxis}`} aria-hidden="true">
            <span />
            <span className={styles.tlScale}>
              {WEEKS.map((w, i) => (
                <span key={w} style={{ left: `${((i + 1) / WEEKS.length) * 100}%` }}>
                  {w}
                </span>
              ))}
            </span>
            <span />
          </div>

          <ul className={styles.tlRows}>
            {items.map((it) => (
              <li key={it.label} className={styles.tlRow} data-tl-row>
                <i className={styles.rule} data-tl-rule aria-hidden="true" />
                <span className={styles.tlLabel} data-tl-text>
                  {it.label}
                </span>
                <span className={styles.tlTrack} aria-hidden="true">
                  <span className={styles.tlBar} data-tl-bar style={{ width: pct(it.max) }}>
                    <i className={styles.tlUsual} style={{ width: `${(it.min / it.max) * 100}%` }} />
                  </span>
                </span>
                <span className={styles.tlTime} data-tl-text>
                  {it.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.tlFoot}>
          <p className={styles.tlNote}>{note}</p>
          <ArrowLink href="#contact" onClick={(e) => go("#contact", e)}>
            Send a brief
          </ArrowLink>
        </div>
      </div>
    </section>
  );
}
