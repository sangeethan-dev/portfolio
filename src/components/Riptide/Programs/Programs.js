"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { programs } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import Button from "../ui/Button";
import SceneVideo from "../ui/SceneVideo";
import Eyebrow from "../ui/Eyebrow";
import useWordReveal from "../ui/useWordReveal";
import styles from "./Programs.module.css";

export default function Programs() {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const { open } = useBooking();

  useWordReveal(titleRef);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.utils.toArray(`.${styles.item}`, rootRef.current).forEach((item) => {
          const media = item.querySelector(`.${styles.media}`);
          const inner = media.querySelector("img, video") ? media.firstElementChild : media;
          gsap.fromTo(
            media,
            { clipPath: "inset(18% 12% 18% 12% round 6px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 6px)",
              ease: "none",
              scrollTrigger: { trigger: item, start: "top 90%", end: "top 30%", scrub: 0.6 },
            }
          );
          gsap.fromTo(
            inner,
            { scale: 1.25, yPercent: -6 },
            { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } }
          );
          gsap.from(item.querySelectorAll("[data-rise]"), {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: { trigger: item, start: "top 72%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="programs" className={styles.section} aria-labelledby="prog-title">
      <div className={styles.wrap}>
        <header className={styles.head}>
          <Eyebrow>Programs</Eyebrow>
          <h2 ref={titleRef} id="prog-title" className={styles.title}>
            Programs with a <em>finish line</em>
          </h2>
          <p className={styles.intro}>{programs.intro}</p>
        </header>

        <ol className={styles.list}>
          {programs.items.map((p, i) => (
            <li key={p.name} className={`${styles.item} ${i % 2 ? styles.flip : ""}`}>
              <div className={styles.media}>
                {p.video ? (
                  <SceneVideo src={p.video} poster={p.poster} className={styles.mediaInner} />
                ) : (
                  <div className={styles.mediaInner}>
                    <img src={p.img} alt="" loading="lazy" decoding="async" />
                  </div>
                )}
                <span className={styles.tag}>{p.length}</span>
              </div>
              <div className={styles.body}>
                <p className={styles.index} data-rise>
                  Program <em>0{i + 1}</em>
                </p>
                <h3 className={styles.name} data-rise>
                  {p.name}
                </h3>
                <p className={styles.line} data-rise>
                  {p.line}
                </p>
                <ul className={styles.includes} data-rise>
                  {p.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div data-rise>
                  <Button onClick={() => open({ type: p.name === "Run Clinic" ? "run" : "new", reason: p.name })}>
                    Start with an assessment
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
