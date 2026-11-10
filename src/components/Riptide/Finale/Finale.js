"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { scrollToSection } from "@/lib/lenis/useLenis";
import { clinic, finale, nav } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import { Logo } from "../Nav/Nav";
import Button from "../ui/Button";
import SceneVideo from "../ui/SceneVideo";
import Eyebrow from "../ui/Eyebrow";
import useWordReveal from "../ui/useWordReveal";
import styles from "./Finale.module.css";

export default function Finale() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const titleRef = useRef(null);
  const { open } = useBooking();

  useWordReveal(titleRef, { scrub: true, start: "top 90%" });

  /* The last scene settles in as it arrives */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(rootRef);
        gsap
          .timeline({
            scrollTrigger: { trigger: stageRef.current, start: "top bottom", end: "top top", scrub: true },
          })
          .fromTo(q(`.${styles.media}`), { scale: 1.2, yPercent: -10 }, { scale: 1, yPercent: 0, ease: "none" }, 0);
        gsap.from(q(`.${styles.actions} > *, .${styles.meta}`), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: stageRef.current, start: "top 35%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  function go(href, e) {
    e.preventDefault();
    scrollToSection(href, href === "#top" ? 0 : -8);
  }

  return (
    <section ref={rootRef} className={styles.section} aria-labelledby="finale-title">
      <div ref={stageRef} id="credits" className={styles.stage}>
        <SceneVideo src={finale.video} poster={finale.poster} className={styles.media} />
        <div className={styles.shade} />

        <div className={styles.content}>
          <Eyebrow>Book a visit</Eyebrow>
          <h2 ref={titleRef} id="finale-title" className={styles.title}>
            Your comeback <em>starts here.</em>
          </h2>
          <div className={styles.actions}>
            <Button size="lg" onClick={() => open({ type: "new" })}>
              Book an appointment
            </Button>
            <Button size="lg" variant="ghost" icon="phone" href={clinic.phoneHref}>
              {clinic.phone}
            </Button>
          </div>
          <p className={styles.meta}>No referral needed · HICAPS on the spot · Open 6am weekdays and Saturday mornings</p>
        </div>
      </div>

      <footer id="visit" className={styles.footer}>
        <div className={styles.info}>
          <div className={styles.col}>
            <h3 className={styles.h}>Visit</h3>
            <address className={styles.addr}>
              {clinic.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <a href={clinic.mapsHref} target="_blank" rel="noopener noreferrer" className={styles.link}>
              Get directions ↗
            </a>
            <a
              href={clinic.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.map}
              aria-label={`Open directions to ${clinic.address.join(", ")}`}
            >
              <iframe
                title={`Map of ${clinic.suburb}`}
                src={clinic.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer"
                tabIndex={-1}
              />
              <span className={styles.pin} aria-hidden="true" />
            </a>
            <p className={styles.mapCredit}>Map data © OpenStreetMap contributors</p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.h}>Hours</h3>
            <dl className={styles.hours}>
              {clinic.hours.map((h) => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.small}>Public holidays by appointment. Book online 24/7.</p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.h}>Parking &amp; access</h3>
            <p className={styles.text}>{clinic.parking}</p>
            <p className={styles.small}>Step-free entry and an accessible bathroom on the ground floor.</p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.h}>Contact</h3>
            <a href={clinic.phoneHref} className={styles.big}>
              {clinic.phone}
            </a>
            <a href={`mailto:${clinic.email}`} className={styles.link}>
              {clinic.email}
            </a>
            <div className={styles.footBook}>
              <Button onClick={() => open({ type: "new" })}>Book online</Button>
            </div>
          </div>
        </div>

        <div className={styles.ack}>
          <span className={styles.ackMark} aria-hidden="true" />
          <p>{finale.acknowledgement}</p>
        </div>

        <div className={styles.bottom}>
          <a href="#top" onClick={(e) => go("#top", e)} className={styles.logo} aria-label="Back to top">
            <Logo />
          </a>
          <nav className={styles.footNav} aria-label="Footer">
            {nav.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => go(l.href, e)}>
                {l.label}
              </a>
            ))}
          </nav>
          <p className={styles.legal}>
            © {new Date().getFullYear()} {clinic.name}. Est. {clinic.founded}.
            <span> · </span>
            <a href="/">Website by Sangeethan</a>
          </p>
        </div>
      </footer>
    </section>
  );
}
