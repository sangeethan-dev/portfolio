"use client";

import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { scrollToSection } from "@/lib/lenis/useLenis";
import { faqs } from "@/content/site";
import ArrowLink from "@/components/ArrowLink/ArrowLink";
import styles from "./FAQ.module.css";

const DOT = 52; // collapsed "typing" bubble size (px)
const DEFAULT_INTRO = "The questions people ask me most. Tap one and I'll answer it.";
const HEADSHOT = "/portfolio/profile-headshot.webp";

function Typing() {
  return (
    <span className={styles.typing} data-typing aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/*
 * FAQ as a chat you open yourself. Heading on the left (sticky on desktop),
 * the thread on the right. Every question is a message bubble; tap one and
 * I "type" for a moment, then the answer grows to its real size and the
 * lines fade in. Only one answer is open at a time. The first one opens on
 * its own once, when the thread scrolls in, so people see how it works.
 *
 * Reduced motion: answers open and close instantly.
 * Reused on /agencies with its own questions.
 */
export default function FAQ({
  items = faqs,
  fig = "Fig. 08 — FAQ",
  title = "Questions, answered.",
  intro = DEFAULT_INTRO,
}) {
  const rootRef = useRef(null);
  const touched = useRef(false); // the visitor has opened or closed something
  const busy = useRef(new Set()); // answers mid-animation
  const toggleRef = useRef(null); // the scroll-in auto-open needs the latest toggle
  const titleRef = useSplitReveal({ type: "lines" });
  const uid = useId();
  const [open, setOpen] = useState(() => new Set());

  const setItem = (i, on) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (on) next.add(i);
      else next.delete(i);
      return next;
    });

  const { contextSafe } = useGSAP(
    () => {
      const root = rootRef.current;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // typing dots bounce, each dot on its own offset loop
        gsap.to(root.querySelectorAll("[data-typing] i"), {
          y: -4,
          duration: 0.38,
          ease: "sine.inOut",
          stagger: { each: 0.13, repeat: -1, yoyo: true },
        });

        // questions arrive like messages landing in the thread
        gsap.set(root.querySelectorAll("[data-q]"), { autoAlpha: 0, y: 24 });
        const arrive = ScrollTrigger.create({
          trigger: root.querySelector("[data-list]"),
          start: "top 80%",
          once: true,
          onEnter() {
            gsap.to(root.querySelectorAll("[data-q]"), {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "expo.out",
              stagger: 0.07,
              onComplete: () => {
                if (!touched.current) toggleRef.current?.(0, true);
              },
            });
          },
        });

        // the + spins a little on hover, so it reads as something to press
        const offs = [];
        if (window.matchMedia(MQ.finePointer).matches) {
          root.querySelectorAll("[data-q] button").forEach((btn) => {
            const icon = btn.querySelector("[data-icon]");
            const enter = () => gsap.to(icon, { scale: 1.15, duration: 0.3, ease: "back.out(3)" });
            const leave = () => gsap.to(icon, { scale: 1, duration: 0.3, ease: "power2.out" });
            btn.addEventListener("mouseenter", enter);
            btn.addEventListener("mouseleave", leave);
            offs.push(() => {
              btn.removeEventListener("mouseenter", enter);
              btn.removeEventListener("mouseleave", leave);
            });
          });
        }

        return () => {
          arrive.kill();
          offs.forEach((f) => f());
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* + → −: the whole icon turns half a circle while the upright bar folds away */
  function iconTo(i, isOpen, instant) {
    const icon = rootRef.current.querySelector(`[data-icon="${i}"]`);
    const bar = icon.querySelector("[data-bar-v]");
    if (instant) {
      gsap.set(icon, { rotate: isOpen ? 180 : 0 });
      gsap.set(bar, { scaleY: isOpen ? 0 : 1 });
      return;
    }
    gsap.to(icon, { rotate: isOpen ? 180 : 0, duration: 0.55, ease: isOpen ? "back.out(1.8)" : "power3.inOut", overwrite: "auto" });
    gsap.to(bar, { scaleY: isOpen ? 0 : 1, duration: 0.3, delay: isOpen ? 0.08 : 0, ease: "power2.inOut", overwrite: "auto" });
  }

  /* Open: show it as a small typing bubble, then grow it to its real size */
  const openAnim = contextSafe((i) => {
    const root = rootRef.current;
    const row = root.querySelector(`[data-a="${i}"]`);
    const msg = row.querySelector("[data-msg]");
    const typing = msg.querySelector("[data-typing]");
    const lines = msg.querySelectorAll("[data-line]");
    const avatar = row.querySelector("[data-avatar]");

    gsap.killTweensOf([row, msg, typing, lines, avatar]);
    gsap.set([row, msg], { clearProps: "all" });

    // read the natural size and styles NOW, as plain values: getComputedStyle
    // is live, and would report the collapsed (zero) padding once we shrink it
    const cs = getComputedStyle(msg);
    const pad = { paddingTop: cs.paddingTop, paddingRight: cs.paddingRight, paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft };
    const radius = {
      borderTopLeftRadius: cs.borderTopLeftRadius,
      borderTopRightRadius: cs.borderTopRightRadius,
      borderBottomRightRadius: cs.borderBottomRightRadius,
      borderBottomLeftRadius: cs.borderBottomLeftRadius,
    };
    // rounded UP so the last word never wraps
    const W = Math.ceil(msg.getBoundingClientRect().width) + 1;
    gsap.set(msg, { width: W });
    const H = Math.ceil(msg.getBoundingClientRect().height);

    gsap.set(msg, { width: DOT, height: DOT, borderRadius: DOT / 2, padding: 0, scale: 0, transformOrigin: "right center" });
    gsap.set(typing, { autoAlpha: 1 });
    gsap.set(lines, { autoAlpha: 0, y: 6 });
    gsap.set(avatar, { scale: 0 });

    busy.current.add(i);
    gsap
      .timeline({
        onComplete() {
          gsap.set(msg, { clearProps: "width,height,padding,borderRadius,transform" });
          busy.current.delete(i);
          ScrollTrigger.refresh();
        },
      })
      .to(msg, { scale: 1, duration: 0.35, ease: "back.out(2.2)" }, 0)
      .to(avatar, { scale: 1, duration: 0.3, ease: "back.out(2.2)" }, 0.1)
      .to(typing, { autoAlpha: 0, duration: 0.15 }, 0.95)
      .to(msg, { width: W, ...radius, paddingLeft: pad.paddingLeft, paddingRight: pad.paddingRight, duration: 0.42, ease: "power3.inOut" }, 1)
      .to(msg, { height: H, paddingTop: pad.paddingTop, paddingBottom: pad.paddingBottom, duration: 0.42, ease: "power3.inOut" }, 1.2)
      .to(lines, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: "power2.out" }, 1.45);
  });

  /* Close: fold the answer away, then drop it from the layout */
  const closeAnim = contextSafe((i, done) => {
    const row = rootRef.current.querySelector(`[data-a="${i}"]`);
    gsap.killTweensOf([row, ...row.querySelectorAll("*")]);
    busy.current.add(i);
    gsap
      .timeline({
        onComplete() {
          busy.current.delete(i);
          done();
          gsap.set(row, { clearProps: "all" });
          ScrollTrigger.refresh();
        },
      })
      .set(row, { overflow: "hidden" }, 0)
      .to(row, { height: 0, autoAlpha: 0, duration: 0.35, ease: "power2.inOut" }, 0);
  });

  function toggle(i, fromScroll = false) {
    if (!fromScroll) touched.current = true;
    if (busy.current.has(i)) return;
    const isOpen = open.has(i);
    const others = [...open].filter((j) => j !== i);
    const reduced = window.matchMedia(MQ.reduced).matches;

    if (reduced) {
      setOpen(isOpen ? new Set() : new Set([i]));
      others.forEach((j) => iconTo(j, false, true));
      iconTo(i, !isOpen, true);
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    // only one answer open at a time
    others.forEach((j) => {
      iconTo(j, false);
      closeAnim(j, () => flushSync(() => setItem(j, false)));
    });

    iconTo(i, !isOpen);
    if (isOpen) {
      closeAnim(i, () => flushSync(() => setItem(i, false)));
    } else {
      flushSync(() => setItem(i, true)); // in the layout before we measure it
      openAnim(i);
    }
  }
  toggleRef.current = toggle;

  return (
    <section id="faq" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.layout}`}>
        <div className={styles.head}>
          <span className="label">{fig}</span>
          <h2 ref={titleRef} className={styles.title}>
            {title}
          </h2>
          <p className={styles.intro}>{intro}</p>
          <ArrowLink
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#contact", 0);
            }}
          >
            Ask me something else
          </ArrowLink>
        </div>

        <div className={styles.thread}>
          <div className={styles.chatHead}>
            <Image src={HEADSHOT} alt="Sangeethan" width={88} height={88} className={styles.headAvatar} />
            <span className={styles.headText}>
              <b>Sangeethan</b>
              <span className={styles.status}>
                <i /> Usually replies within 24 hours
              </span>
            </span>
            <span className={styles.count}>{String(items.length).padStart(2, "0")} questions</span>
          </div>

          <ul className={styles.list} data-list>
            {items.map((f, i) => {
              const isOpen = open.has(i);
              const qId = `${uid}-q${i}`;
              const aId = `${uid}-a${i}`;
              return (
                <li key={f.q} className={styles.pair}>
                  <h3 className={styles.rowQ} data-q>
                    <button
                      type="button"
                      id={qId}
                      className={styles.q}
                      aria-expanded={isOpen}
                      aria-controls={aId}
                      data-open={isOpen}
                      data-cursor={isOpen ? "Close" : "Ask"}
                      onClick={() => toggle(i)}
                    >
                      <span className={styles.qText}>{f.q}</span>
                      <span className={styles.icon} data-icon={i} aria-hidden="true">
                        <i className={styles.barH} />
                        <i className={styles.barV} data-bar-v />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={aId}
                    role="region"
                    aria-labelledby={qId}
                    className={styles.rowA}
                    data-a={i}
                    hidden={!isOpen}
                  >
                    <div className={styles.msg} data-msg>
                      <Typing />
                      <div className={styles.content}>
                        {f.a.map((line) => (
                          <p key={line} data-line>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    <span className={styles.avatar} data-avatar aria-hidden="true">
                      <Image src={HEADSHOT} alt="" width={64} height={64} />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
