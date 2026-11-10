"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { clinic, services } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import Button from "../ui/Button";
import Eyebrow from "../ui/Eyebrow";
import useWordReveal from "../ui/useWordReveal";
import styles from "./Services.module.css";

export default function Services() {
  const rootRef = useRef(null);
  const pinRef = useRef(null);
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const { open } = useBooking();

  useWordReveal(titleRef);

  /* Desktop: the strip runs sideways while the section is pinned.
     Phones and reduced motion: a normal swipeable row. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const track = trackRef.current;
        const dist = () => track.scrollWidth - viewRef.current.clientWidth;
        const run = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray(`.${styles.pic} img`, rootRef.current).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -5 },
            {
              xPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest(`.${styles.frame}`),
                containerAnimation: run,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        });
        gsap.to(`.${styles.counter}`, {
          "--p": 1,
          ease: "none",
          scrollTrigger: { trigger: pinRef.current, start: "top top", end: () => `+=${dist()}`, scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="treatments" className={styles.section} aria-labelledby="svc-title">
      <div ref={pinRef} className={styles.pin}>
        <header className={styles.head}>
          <div>
            <Eyebrow>Treatments</Eyebrow>
            <h2 ref={titleRef} id="svc-title" className={styles.title}>
              What we <em>treat</em>
            </h2>
          </div>
          <div className={styles.side}>
            <p>Seven ways back to moving well. Every treatment starts with a proper assessment.</p>
            <span className={styles.counter} aria-hidden="true">
              <i />
            </span>
          </div>
        </header>

        <div ref={viewRef} className={styles.viewport}>
          <ol ref={trackRef} className={styles.track}>
            {services.items.map((s, i) => (
              <li key={s.title} className={styles.frame}>
                <div className={styles.pic}>
                  <img src={s.img} alt="" loading="lazy" decoding="async" />
                </div>
                <div className={styles.caption}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={styles.name}>{s.title}</h3>
                  <p className={styles.line}>{s.line}</p>
                  <Button variant="text" onClick={() => open({ type: "new", reason: s.title })}>
                    Book
                  </Button>
                </div>
              </li>
            ))}
            <li className={`${styles.frame} ${styles.endCard}`}>
              <p className={styles.endKicker}>Not on the list?</p>
              <p className={styles.endTitle}>If it hurts when you move, we can help.</p>
              <Button variant="ghost" icon="phone" href={clinic.phoneHref}>
                {clinic.phone}
              </Button>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
