"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { syncTheme } from "@/lib/gsap/theme";
import { getLenis } from "@/lib/lenis/useLenis";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { concepts } from "@/content/site";
import ClinicConcept from "./concepts/ClinicConcept";
import CafeConcept from "./concepts/CafeConcept";
import StoreConcept from "./concepts/StoreConcept";
import RecentFixes from "./RecentFixes";
import styles from "./Work.module.css";

const PREVIEWS = {
  clinic: ClinicConcept,
  cafe: CafeConcept,
  store: StoreConcept,
};

/* Each room is painted in its client's brand. tone = the page theme
   (header colours etc.) while that room covers the middle of the screen —
   read by useThemeFlip via data-tone. */
const ROOMS = {
  clinic: { tone: "blueprint", url: "tidewaterphysio.com.au" },
  cafe: { tone: "live", url: "groundsandco.com.au" },
  store: { tone: "blueprint", url: "saltandfern.com.au" },
};

const DEFAULT_INTRO =
  "Most of my client work was built for other brands, so it isn't mine to show. Instead I built these three. The businesses are made up, but the websites are real and they work, so go ahead and try them.";

/*
 * Concept projects as a pinned horizontal gallery (desktop): an index page,
 * then one full-screen "room" per project, each painted in that client's
 * brand colours, so the page turns into the client as you scroll. The live
 * site tilts into place; the project's name drifts behind it.
 *
 * Phones, tablets and reduced motion get the same rooms stacked vertically.
 * Props let another page reuse it with its own label, intro and no fixes strip.
 */
export default function Work({
  fig = "Fig. 05 — Work",
  title = "Concept projects",
  intro = DEFAULT_INTRO,
  note = null,
  showFixes = true,
}) {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const stRef = useRef(null);
  const headRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      const rooms = gsap.utils.toArray("[data-room]", root);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        root.dataset.mode = "horizontal";
        const dist = () => track.scrollWidth - window.innerWidth;

        const slide = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          // the scrub keeps sliding after the scroll stops — keep the theme in step
          onUpdate: syncTheme,
          scrollTrigger: {
            trigger: pinRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${dist()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(barRef.current, { scaleX: self.progress }),
          },
        });
        stRef.current = slide.scrollTrigger;

        rooms.forEach((room) => {
          const inside = { trigger: room, containerAnimation: slide };

          // the name drifts slower than the room — depth
          gsap.fromTo(
            room.querySelector("[data-bigname]"),
            { xPercent: 20 },
            { xPercent: -30, ease: "none", scrollTrigger: { ...inside, start: "left right", end: "right left", scrub: true } }
          );
          // the live site swings in like a door
          gsap.from(room.querySelector("[data-device]"), {
            rotateY: -24,
            scale: 0.86,
            xPercent: 18,
            ease: "none",
            scrollTrigger: { ...inside, start: "left right", end: "left 20%", scrub: true },
          });
        });

        return () => {
          delete root.dataset.mode;
          stRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  /* Index links: jump straight to a room (horizontally on desktop) */
  function goToRoom(e, id) {
    e.preventDefault();
    const room = rootRef.current.querySelector(`[data-room="${id}"]`);
    const lenis = getLenis();
    const st = stRef.current;
    let y;
    if (st) {
      const track = trackRef.current;
      const p = room.offsetLeft / (track.scrollWidth - window.innerWidth);
      y = st.start + p * (st.end - st.start);
    } else {
      y = room.getBoundingClientRect().top + window.scrollY;
    }
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <section id="work" ref={rootRef} className={styles.section} data-theme-section="live">
      <div ref={pinRef} className={styles.pin}>
        <div ref={trackRef} className={styles.track}>
          {/* ── Index ── */}
          <div className={styles.index}>
            <span className="label">{fig}</span>
            <h2 ref={headRef} className={styles.title}>
              {title}
            </h2>
            <div className={styles.indexFoot}>
              <div className={styles.intro}>
                {note && <p className={styles.note}>{note}</p>}
                <p>{intro}</p>
              </div>
              <ol className={styles.toc}>
                {concepts.map((c, i) => (
                  <li key={c.id}>
                    <a href={`#room-${c.id}`} className={styles.tocLink} onClick={(e) => goToRoom(e, c.id)}>
                      <span className={styles.tocNum}>0{i + 1}</span>
                      <span className={styles.tocName}>{c.name}</span>
                      <span className={styles.tocSector}>{c.sector}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <span className={`label ${styles.scrollHint}`} aria-hidden="true">
              Scroll to walk through <span>→</span>
            </span>
          </div>

          {/* ── One room per project ── */}
          {concepts.map((c, i) => {
            const Preview = PREVIEWS[c.id];
            const room = ROOMS[c.id];
            return (
              <article
                key={c.id}
                id={`room-${c.id}`}
                className={`${styles.room} ${styles[c.id]}`}
                data-room={c.id}
                data-tone={room.tone}
              >
                <span className={styles.bigname} data-bigname aria-hidden="true">
                  {c.name}
                </span>

                <div className={styles.info}>
                  <div className={styles.metaRow}>
                    <span className={styles.badge}>Concept project</span>
                    <span className={styles.num}>
                      0{i + 1} / 0{concepts.length}
                    </span>
                  </div>

                  <h3 className={styles.name}>{c.name}</h3>
                  <p className={styles.sector}>{c.sector}</p>
                  <p className={styles.brief}>{c.brief}</p>

                  <ul className={styles.built}>
                    {c.built.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  <div className={styles.foot}>
                    <span className={styles.pkg}>
                      <span className={styles.pkgLabel}>Package</span>
                      {c.package}
                    </span>
                    <span className={styles.hint}>
                      <i className={styles.hintDot} />
                      {c.hint}
                    </span>
                  </div>
                </div>

                <div className={styles.stage}>
                  <div className={styles.device} data-device>
                    <div className={styles.chrome} aria-hidden="true">
                      <span className={styles.dots}>
                        <i />
                        <i />
                        <i />
                      </span>
                      <span className={styles.url}>{room.url}</span>
                    </div>
                    <div className={styles.preview}>
                      <Preview />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.progress} aria-hidden="true">
          <span className={styles.progressTrack}>
            <i ref={barRef} className={styles.progressBar} />
          </span>
        </div>
      </div>

      {showFixes && <RecentFixes />}
    </section>
  );
}
