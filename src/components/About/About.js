"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { SCRAMBLE_CHARS } from "@/lib/gsap/useScramble";
import { stats } from "@/content/site";
import styles from "./About.module.css";

const ID_ROWS = [
  ["Name", "S. Sangeethan"],
  ["Role", "Creative web developer"],
  ["Based", "Colombo, Sri Lanka"],
  ["Clients", "Australia · AEST"],
  ["Stack", "Next.js · GSAP · WP · Shopify"],
  ["Status", "Taking new projects"],
];

export default function About() {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const statementRef = useSplitReveal({ type: "lines", stagger: 0.06 });

  /* ID card tilts toward the pointer */
  useEffect(() => {
    if (!window.matchMedia(MQ.finePointer).matches || window.matchMedia(MQ.reduced).matches) return;
    const card = cardRef.current;
    const area = rootRef.current;
    const rx = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" });
    gsap.set(card, { transformPerspective: 900 });

    function onMove(e) {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const py = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      ry(px * 22);
      rx(-py * 22);
    }
    function onLeave() {
      rx(0);
      ry(0);
    }
    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  /* Card values decode in, stats count up */
  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const vals = q("[data-id-val]");
        const nums = q("[data-stat]");
        const tl = gsap.timeline({ paused: true });
        const originals = [...vals, ...nums].map((el) => [el, el.textContent]);
        vals.forEach((el, i) => {
          const text = el.textContent;
          el.textContent = "";
          tl.to(el, { duration: 0.7, scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.7 } }, i * 0.08);
        });
        nums.forEach((el) => {
          const target = Number(el.dataset.value);
          const o = { v: 0 };
          el.textContent = "0" + el.dataset.suffix;
          tl.to(
            o,
            {
              v: target,
              duration: 1.4,
              ease: "power3.out",
              onUpdate: () => (el.textContent = Math.round(o.v) + el.dataset.suffix),
            },
            0.2
          );
        });
        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top 70%",
          once: true,
          onEnter: () => tl.play(),
        });
        return () => {
          st.kill();
          tl.kill();
          originals.forEach(([el, text]) => (el.textContent = text));
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="about" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="label">Fig. 06 — About</span>
          <p ref={statementRef} className={styles.statement}>
            Hi, I&apos;m Sangeethan. I&apos;ve been building websites for eight years, and I started out at a
            digital marketing agency. Now I build sites for small practices and local businesses that want to
            look professional, show up in local searches, and make booking easy. You&apos;ll work with me
            directly, from the first call to launch day.
          </p>

          <dl className={styles.stats}>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={styles.statNum} data-stat data-value={s.value} data-suffix={s.suffix}>
                  {s.value}
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.cardWrap}>
          <div ref={cardRef} className={styles.card}>
            <div className={styles.cardHead}>
              <span>Developer ID</span>
              <span className={styles.cardNo}>No. 0008-SG</span>
            </div>
            <div className={styles.avatar}>
              <Image
                src="/portfolio/profile-portrait.webp"
                alt="Portrait of Sangeethan"
                width={720}
                height={900}
                sizes="140px"
                className={styles.photo}
              />
              <span className={styles.avatarRing} aria-hidden="true" />
            </div>
            <dl className={styles.idRows}>
              {ID_ROWS.map(([k, v]) => (
                <div key={k} className={styles.idRow}>
                  <dt>{k}</dt>
                  <dd data-id-val>{v}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.barcode} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
