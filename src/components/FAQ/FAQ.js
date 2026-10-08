"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { scrollToSection } from "@/lib/lenis/useLenis";
import { faqs } from "@/content/site";
import styles from "./FAQ.module.css";

const DOT = 52; // collapsed "typing" bubble size (px)
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
 * FAQ as a chat thread. Each bubble scrolls in as a small "typing…" dot,
 * then expands to its real size and the lines fade in. Scrolling back
 * reverses it. Rows reserve the bubble's full height up front, so nothing
 * on the page jumps while bubbles grow.
 *
 * Without motion (or JS) every bubble is simply shown in full.
 */
export default function FAQ() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const root = rootRef.current;
      const mm = gsap.matchMedia();

      /* One build = measure every bubble at its natural size, then collapse it.
         Wrapped in a context so a resize can revert and re-measure. */
      function build() {
        return gsap.context(() => {
          const rows = [];
          root.querySelectorAll("[data-msg]").forEach((msg) => {
            const row = msg.closest("[data-row]");
            const avatar = row.querySelector("[data-avatar]");
            const typing = msg.querySelector("[data-typing]");
            const lines = msg.querySelectorAll("[data-line]");

            const cs = getComputedStyle(msg);
            const pad = {
              top: cs.paddingTop,
              right: cs.paddingRight,
              bottom: cs.paddingBottom,
              left: cs.paddingLeft,
            };
            // corners animate individually so the chat "tail" corner survives
            const radius = {
              borderTopLeftRadius: cs.borderTopLeftRadius,
              borderTopRightRadius: cs.borderTopRightRadius,
              borderBottomRightRadius: cs.borderBottomRightRadius,
              borderBottomLeftRadius: cs.borderBottomLeftRadius,
            };

            // natural size at the current layout — rounded UP, or a line that
            // measures 461.4px gets a 461px box and its last word wraps
            const W = Math.ceil(msg.getBoundingClientRect().width) + 1;
            gsap.set(msg, { width: W });
            const H = Math.ceil(msg.getBoundingClientRect().height);
            row.style.minHeight = `${H}px`; // reserve the expanded height so the page never grows
            rows.push(row);

            // collapsed: a small round "typing" bubble
            gsap.set(msg, {
              width: DOT,
              height: DOT,
              borderRadius: DOT / 2,
              padding: 0,
              scale: 0,
              transformOrigin: row.dataset.row === "a" ? "right center" : "left center",
            });
            gsap.set(typing, { autoAlpha: 1 });
            gsap.set(lines, { autoAlpha: 0, y: 6 });
            if (avatar) gsap.set(avatar, { scale: 0 });

            let collapseWhenDone = false;

            const enter = gsap.timeline({ paused: true });
            enter.to(msg, { scale: 1, duration: 0.45, ease: "back.out(2.2)" });

            const expand = gsap.timeline({
              paused: true,
              onReverseComplete() {
                if (collapseWhenDone) {
                  collapseWhenDone = false;
                  enter.reverse();
                }
              },
            });
            expand
              .to(typing, { autoAlpha: 0, duration: 0.2 })
              .to(msg, {
                width: W,
                ...radius,
                paddingLeft: pad.left,
                paddingRight: pad.right,
                duration: 0.45,
                ease: "power3.inOut",
              })
              .to(
                msg,
                {
                  height: H,
                  paddingTop: pad.top,
                  paddingBottom: pad.bottom,
                  duration: 0.45,
                  ease: "power3.inOut",
                },
                "-=0.22"
              )
              .to(lines, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }, "-=0.2");
            // avatar pops in beside the finished bubble, like a sent message
            if (avatar) expand.to(avatar, { scale: 1, duration: 0.35, ease: "back.out(2.2)" }, "-=0.15");

            ScrollTrigger.create({
              trigger: msg,
              start: "top 88%",
              onEnter() {
                collapseWhenDone = false;
                enter.play();
              },
              onLeaveBack() {
                if (expand.progress() > 0) collapseWhenDone = true;
                else enter.reverse();
              },
            });

            ScrollTrigger.create({
              trigger: msg,
              start: "top 76%",
              onEnter: () => expand.play(),
              onLeaveBack: () => expand.reverse(),
            });
          });

          // typing dots bounce, each dot on its own offset loop
          gsap.to(root.querySelectorAll("[data-typing] i"), {
            y: -4,
            duration: 0.38,
            ease: "sine.inOut",
            stagger: { each: 0.13, repeat: -1, yoyo: true },
          });

          // the "ask your own" composer slides up at the end of the thread
          gsap.from(root.querySelector("[data-composer]"), {
            y: 30,
            autoAlpha: 0,
            duration: 0.7,
            ease: "expo.out",
            scrollTrigger: {
              trigger: root.querySelector("[data-composer]"),
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          });
          // context cleanup: release the reserved heights before re-measuring
          return () => rows.forEach((r) => (r.style.minHeight = ""));
        }, root);
      }

      mm.add(MQ.motion, () => {
        let ctx = null;
        let cancelled = false;
        let lastWidth = window.innerWidth;
        let timer = 0;

        // measure only once the webfonts are in, or bubble sizes would be off
        const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        ready.then(() => {
          if (cancelled) return;
          ctx = build();
          ScrollTrigger.refresh();
        });

        function onResize() {
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (!ctx || window.innerWidth === lastWidth) return; // ignore mobile URL-bar resizes
            lastWidth = window.innerWidth;
            ctx.revert();
            ctx = build();
            ScrollTrigger.refresh();
          }, 250);
        }
        window.addEventListener("resize", onResize);

        return () => {
          cancelled = true;
          clearTimeout(timer);
          window.removeEventListener("resize", onResize);
          if (ctx) ctx.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="faq" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 07 — FAQ</span>
        <h2 ref={titleRef} className={styles.title}>
          Questions, answered.
        </h2>
        <p className={styles.intro}>
          The questions practice owners ask me most, answered the way I&apos;d answer them over chat.
        </p>
      </div>

      <div className="container">
        <div className={styles.thread}>
          <div className={styles.chatHead}>
            <Image
              src={HEADSHOT}
              alt="Sangeethan"
              width={88}
              height={88}
              className={styles.headAvatar}
            />
            <span className={styles.headText}>
              <b>Sangeethan</b>
              <span className={styles.status}>
                <i /> Usually replies within 24 hours
              </span>
            </span>
            <span className={styles.count}>{String(faqs.length).padStart(2, "0")} questions</span>
          </div>

          <dl className={styles.list}>
            {faqs.map((f) => (
              <div key={f.q} className={styles.pair}>
                <dt className={`${styles.row} ${styles.rowQ}`} data-row="q">
                  <div className={`${styles.msg} ${styles.q}`} data-msg>
                    <Typing />
                    <div className={styles.content}>
                      <p data-line>{f.q}</p>
                    </div>
                  </div>
                </dt>
                <dd className={`${styles.row} ${styles.rowA}`} data-row="a">
                  <div className={`${styles.msg} ${styles.a}`} data-msg>
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
                </dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            className={styles.composer}
            data-composer
            data-cursor="Ask"
            onClick={() => scrollToSection("#contact", 0)}
          >
            <span className={styles.composerText}>Got a question that&apos;s not here? Ask me directly…</span>
            <span className={styles.send} aria-hidden="true">
              ↑
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
