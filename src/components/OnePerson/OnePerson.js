"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { onePerson } from "@/content/site";
import styles from "./OnePerson.module.css";

/*
 * "One person. No chain." A brief passes down a chain of people on its way
 * to becoming a website. As you scroll, the chain collapses into one person
 * and the line from brief to website runs straight through them.
 * The chain runs across on desktop and down the page on phones; the people
 * are measured against the centre, so the same tween works for both.
 */
export default function OnePerson() {
  const rootRef = useRef(null);
  const chainRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const mm = gsap.matchMedia();

      mm.add(MQ.reduced, () => {
        gsap.set(q("[data-link]"), { autoAlpha: 0 });
        gsap.set(q("[data-me]"), { autoAlpha: 1 });
      });

      mm.add({ motion: MQ.motion, vertical: "(max-width: 767px)" }, (ctx) => {
        if (!ctx.conditions.motion) return;
        const { vertical } = ctx.conditions;

        function toCentre(el, axis) {
          const c = chainRef.current.getBoundingClientRect();
          const r = el.getBoundingClientRect();
          return axis === "x" ? c.left + c.width / 2 - (r.left + r.width / 2) : c.top + c.height / 2 - (r.top + r.height / 2);
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chainRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        tl.fromTo(q("[data-fill]"), vertical ? { scaleY: 0 } : { scaleX: 0 }, { ...(vertical ? { scaleY: 1 } : { scaleX: 1 }), ease: "none", duration: 1 }, 0)
          .to(q("[data-link]"), { x: (i, el) => toCentre(el, "x"), y: (i, el) => toCentre(el, "y"), ease: "power2.inOut", duration: 0.7 }, 0)
          .to(q("[data-link]"), { autoAlpha: 0, duration: 0.15, ease: "none" }, 0.55)
          .fromTo(q("[data-me]"), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, ease: "back.out(2)", duration: 0.3 }, 0.6);

        gsap.from(q("[data-no]"), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-nos]")[0], start: "top 85%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="one-person" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 06 — Why one person</span>
        <h2 ref={titleRef} className={styles.title}>
          {onePerson.title}
        </h2>
      </div>

      <div className="container">
        <div ref={chainRef} className={styles.chain} aria-hidden="true">
          <span className={styles.line}>
            <i data-fill />
          </span>
          <span className={styles.end}>{onePerson.from}</span>
          {onePerson.chain.map((c) => (
            <span key={c} className={styles.link} data-link>
              {c}
            </span>
          ))}
          <span className={styles.end}>{onePerson.to}</span>

          <span className={styles.meWrap}>
            <span className={styles.me} data-me>
              <Image src="/portfolio/profile-headshot.webp" alt="" width={72} height={72} />
              {onePerson.me}
            </span>
          </span>
        </div>
      </div>

      <div className={`container ${styles.body}`}>
        <div className={styles.copy}>
          {onePerson.copy.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className={styles.nos} data-nos>
          <h3 className={styles.nosTitle}>{onePerson.wontTitle}</h3>
          <ul>
            {onePerson.wont.map((w) => (
              <li key={w} className={styles.no} data-no>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
