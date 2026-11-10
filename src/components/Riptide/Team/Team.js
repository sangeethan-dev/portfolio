"use client";

import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { team } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import Eyebrow from "../ui/Eyebrow";
import styles from "./Team.module.css";

export default function Team() {
  const rootRef = useRef(null);
  const [who, setWho] = useState(null);
  const person = team.cast.find((c) => c.id === who);
  const { open } = useBooking();

  /* The heading, then each person one by one */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(rootRef);
        gsap
          .timeline({ scrollTrigger: { trigger: q(`.${styles.titleCard}`)[0], start: "top 75%", once: true } })
          .from(q(`.${styles.title}`), { autoAlpha: 0, scale: 1.12, letterSpacing: "0.3em", duration: 1.8, ease: "expo.out" });

        q(`.${styles.card}`).forEach((card, i) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true } });
          tl.from(card.querySelector(`.${styles.photo}`), {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.3,
            ease: "expo.inOut",
            delay: (i % 4) * 0.12,
          })
            .from(card.querySelector("img"), { scale: 1.3, duration: 1.8, ease: "expo.out" }, "<0.2")
            .from(card.querySelectorAll("[data-credit]"), { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.08, ease: "power3.out" }, "<0.5");
        });

        gsap.from(q(`.${styles.also} > *`), {
          autoAlpha: 0,
          y: 20,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: q(`.${styles.also}`)[0], start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="team" className={styles.section} aria-labelledby="team-title">
      <div className={styles.wrap}>
        <div className={styles.label}>
          <Eyebrow>Our physios</Eyebrow>
        </div>

        <div className={styles.titleCard}>
          <h2 id="team-title" className={styles.title}>
            {team.title}
          </h2>
        </div>

        <ul className={styles.cast}>
          {team.cast.map((c) => (
            <li key={c.id} className={styles.card}>
              <button type="button" className={styles.photoBtn} onClick={() => setWho(c.id)} aria-label={`Meet ${c.name}`}>
                <span className={styles.photo}>
                  <img src={c.img} alt={c.name} loading="lazy" decoding="async" style={{ objectPosition: c.focus }} />
                </span>
              </button>
              <p className={styles.role} data-credit>
                {c.role}
              </p>
              <h3 className={styles.name} data-credit>
                {c.name}
              </h3>
              <p className={styles.spec} data-credit>
                {c.specialty}
              </p>
              <span data-credit>
                <Button variant="text" onClick={() => setWho(c.id)}>
                  Meet {c.name.replace("Dr ", "").split(" ")[0]}
                </Button>
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.also}>
          <p className={styles.alsoLabel}>Also on the team</p>
          {team.alsoStarring.map((a) => (
            <p key={a.name} className={styles.alsoRow}>
              <span>{a.role}</span>
              <i aria-hidden="true" />
              <strong>{a.name}</strong>
            </p>
          ))}
        </div>
      </div>

      <Drawer open={!!person} onClose={() => setWho(null)} label={person ? person.name : "Team member"} wide>
        {person && (
          <article className={styles.bio}>
            <div className={styles.bioPhoto}>
              <img src={person.img} alt={person.name} style={{ objectPosition: person.focus }} />
            </div>
            <p className={styles.role}>{person.role}</p>
            <h3 className={styles.bioName}>{person.name}</h3>
            <p className={styles.bioSpec}>{person.specialty}</p>
            {person.bio.map((p) => (
              <p key={p.slice(0, 20)} className={styles.bioText}>
                {p}
              </p>
            ))}
            <ul className={styles.quals}>
              {person.quals.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
            <Button
              size="lg"
              onClick={() => {
                setWho(null);
                open({ type: "new", practitioner: person.id });
              }}
            >
              Book with {person.name.replace("Dr ", "").split(" ")[0]}
            </Button>
          </article>
        )}
      </Drawer>
    </section>
  );
}
