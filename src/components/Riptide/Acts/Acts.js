"use client";

import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { acts } from "@/content/riptide";
import SceneVideo from "../ui/SceneVideo";
import Eyebrow from "../ui/Eyebrow";
import styles from "./Acts.module.css";

export default function Acts() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(rootRef);
        const scenes = q(`.${styles.act}`);
        const fills = q(`.${styles.fill}`);
        const marks = q(`.${styles.seg}`);

        // Steps 2 and 3 wait below a closed shutter
        gsap.set(scenes.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        scenes.slice(1).forEach((s) => gsap.set(s.querySelectorAll("[data-in]"), { y: 60, autoAlpha: 0 }));

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 3.2}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            snap: { snapTo: [0, 0.5, 1], duration: { min: 0.3, max: 0.8 }, ease: "power2.inOut", delay: 0.1 },
            onUpdate: (self) => {
              const p = self.progress;
              fills.forEach((f, i) => gsap.set(f, { scaleX: gsap.utils.clamp(0, 1, p * 2 - i + 1) }));
              const idx = p < 0.25 ? 0 : p < 0.75 ? 1 : 2;
              if (idx !== activeRef.current) {
                activeRef.current = idx;
                setActive(idx);
                marks.forEach((m, i) => m.classList.toggle(styles.segOn, i === idx));
              }
            },
          },
        });

        // hold · wipe to 2 · hold · wipe to 3 · hold
        [1, 2].forEach((i) => {
          const at = i === 1 ? 0.25 : 1.25;
          const prev = scenes[i - 1];
          const next = scenes[i];
          tl.to(prev.querySelectorAll("[data-in]"), { y: -70, autoAlpha: 0, stagger: 0.03, duration: 0.35 }, at)
            .to(prev.querySelector(`.${styles.media}`), { scale: 1.12, duration: 0.5 }, at)
            .to(next, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power2.inOut" }, at + 0.05)
            .fromTo(next.querySelector(`.${styles.media}`), { scale: 1.25 }, { scale: 1, duration: 0.6 }, at + 0.05)
            .to(next.querySelectorAll("[data-in]"), { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.4, ease: "power2.out" }, at + 0.3);
        });
        tl.to({}, { duration: 0.25 }, 2);
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className={styles.acts} aria-labelledby="acts-title">
      <div ref={stageRef} className={styles.stage}>
        {acts.items.map((a, i) => (
          <article key={a.name} className={styles.act} aria-label={`Step ${a.numeral}: ${a.name}`}>
            <SceneVideo src={a.video} poster={a.poster} active={active === i} className={styles.media} alt="" />
            <div className={styles.shade} />
            <div className={styles.text}>
              <p className={styles.numeral} data-in>
                Step <em>{a.numeral}</em>
              </p>
              <h3 className={styles.name} data-in>
                {a.name}
              </h3>
              <p className={styles.line} data-in>
                {a.line}
              </p>
              <p className={styles.detail} data-in>
                {a.detail}
              </p>
            </div>
          </article>
        ))}

        <header className={styles.head}>
          <Eyebrow>How it works</Eyebrow>
          <h2 id="acts-title" className={styles.title}>
            {acts.title}
          </h2>
        </header>

        <ol className={styles.progress} aria-hidden="true">
          {acts.items.map((a, i) => (
            <li key={a.name} className={`${styles.seg} ${i === 0 ? styles.segOn : ""}`}>
              <span className={styles.track}>
                <span className={styles.fill} />
              </span>
              <span className={styles.segLabel}>
                {a.numeral} · {a.name}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
