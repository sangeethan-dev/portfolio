"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { work } from "@/content/site";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import styles from "./Work.module.css";

/*
 * Websites I've designed and built. Each one is a browser frame with a real
 * screenshot, alternating sides. On scroll the frame opens out from a
 * rounded inset and the screenshot drifts inside it; on hover it leans in.
 * Both frame and link open the site in a new tab.
 */
export default function Work() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const triggers = [];
        gsap.utils.toArray("[data-project]", rootRef.current).forEach((project) => {
          const frame = project.querySelector("[data-frame]");
          const cells = project.querySelectorAll("[data-cell]");

          // reveal once: the frame opens out, then the words rise in
          const reveal = gsap.timeline({ paused: true });
          reveal
            .fromTo(
              frame,
              { clipPath: "inset(10% 8% 10% 8% round 24px)" },
              { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.3, ease: "expo.out" }
            )
            .from(cells, { y: 40, autoAlpha: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }, 0.2);
          triggers.push(ScrollTrigger.create({ trigger: project, start: "top 78%", once: true, onEnter: () => reveal.play() }));

          // the screenshot drifts inside its frame while the project passes
          gsap.fromTo(
            project.querySelector("[data-par]"),
            { yPercent: -5 },
            { yPercent: 5, ease: "none", scrollTrigger: { trigger: project, start: "top bottom", end: "bottom top", scrub: true } }
          );
        });
        return () => triggers.forEach((t) => t.kill());
      });

      // hover: the screenshot leans in a little
      mm.add(`${MQ.motion} and ${MQ.finePointer}`, () => {
        const offs = gsap.utils.toArray("[data-frame]", rootRef.current).map((frame) => {
          const img = frame.querySelector("[data-shot]");
          const enter = () => gsap.to(img, { scale: 1.05, duration: 0.8, ease: "expo.out" });
          const leave = () => gsap.to(img, { scale: 1, duration: 0.8, ease: "expo.out" });
          frame.addEventListener("mouseenter", enter);
          frame.addEventListener("mouseleave", leave);
          return () => {
            frame.removeEventListener("mouseenter", enter);
            frame.removeEventListener("mouseleave", leave);
          };
        });
        return () => offs.forEach((f) => f());
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="work" ref={rootRef} className={styles.section} data-theme-section="blueprint">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 05 — Work</span>
        <h2 ref={titleRef} className={styles.title}>
          {work.title}
        </h2>
        <p className={styles.intro}>{work.intro}</p>
      </div>

      <ol className={`container ${styles.projects}`}>
        {work.items.map((p, i) => (
          <li key={p.href} className={styles.project} data-project>
            <a
              href={p.href}
              target="_blank"
              rel="noopener"
              className={styles.frame}
              data-frame
              data-cursor="View"
              aria-label={`Open the ${p.name} website (opens in a new tab)`}
            >
              <span className={styles.chrome} aria-hidden="true">
                <span className={styles.dots}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.chromeName}>{p.name}</span>
              </span>
              <span className={styles.screen}>
                <span className={styles.par} data-par>
                  <Image
                    src={p.img}
                    alt={`The ${p.name} home page`}
                    fill
                    sizes="(max-width: 1023px) 92vw, 56vw"
                    className={styles.shot}
                    data-shot
                  />
                </span>
              </span>
            </a>

            <div className={styles.info}>
              <span className={styles.num} data-cell>
                {String(i + 1).padStart(2, "0")} / {String(work.items.length).padStart(2, "0")}
              </span>
              <h3 className={styles.name} data-cell>
                {p.name}
              </h3>
              <p className={styles.sector} data-cell>
                {p.sector}
              </p>
              <p className={styles.line} data-cell>
                {p.line}
              </p>
              <ul className={styles.tags} data-cell>
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <span data-cell>
                <ArrowLink href={p.href} target="_blank" rel="noopener" arrow="out">
                  View the website
                </ArrowLink>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
