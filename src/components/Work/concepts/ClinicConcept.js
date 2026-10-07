"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsap";
import styles from "./ClinicConcept.module.css";

/* Fictional practice data — this is a concept site */
const SERVICES = [
  { id: "initial", name: "Initial consult", mins: 45 },
  { id: "follow", name: "Follow-up", mins: 30 },
  { id: "pilates", name: "Clinical Pilates", mins: 55 },
];

const PRACTITIONERS = [
  { id: "mia", name: "Mia", initials: "MR" },
  { id: "josh", name: "Josh", initials: "JT" },
];

const DAYS = [
  { id: "mon", short: "Mon", date: "14" },
  { id: "tue", short: "Tue", date: "15" },
  { id: "wed", short: "Wed", date: "16" },
  { id: "thu", short: "Thu", date: "17" },
  { id: "fri", short: "Fri", date: "18" },
];

const TIMES = ["7:30am", "9:00am", "11:15am", "1:40pm", "3:40pm", "5:20pm"];

/* Deterministic "availability" so the same choice always shows the same slots */
function isTaken(prac, day, i) {
  const seed = `${prac}${day}${i}`;
  let h = 0;
  for (let k = 0; k < seed.length; k++) h = (h * 31 + seed.charCodeAt(k)) % 997;
  return h % 3 === 0;
}

export default function ClinicConcept() {
  const rootRef = useRef(null);
  const slotsRef = useRef(null);
  const doneRef = useRef(null);
  const tickRef = useRef(null);
  const [service, setService] = useState(SERVICES[0].id);
  const [prac, setPrac] = useState(PRACTITIONERS[0].id);
  const [day, setDay] = useState(DAYS[1].id);
  const [slot, setSlot] = useState(null);
  const [booked, setBooked] = useState(false);
  const [confirmed, setConfirmed] = useState(null); // snapshot shown on the card

  const reduced = () => window.matchMedia(MQ.reduced).matches;

  /* New practitioner / day → slots re-deal */
  useEffect(() => {
    setSlot(null);
    if (reduced()) return;
    gsap.fromTo(
      slotsRef.current.children,
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.04, overwrite: true }
    );
  }, [prac, day]);

  /* Confirmation card */
  useEffect(() => {
    const card = doneRef.current;
    if (!booked) {
      gsap.to(card, { autoAlpha: 0, duration: reduced() ? 0 : 0.3 });
      return;
    }
    if (reduced()) {
      gsap.set(card, { autoAlpha: 1 });
    } else {
      gsap
        .timeline()
        .fromTo(card, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" })
        .fromTo(tickRef.current, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, ease: "power2.out" }, 0.15);
    }
    const t = gsap.delayedCall(3.2, () => {
      setBooked(false);
      setSlot(null);
    });
    return () => t.kill();
  }, [booked]);

  function pickSlot(i, el) {
    setSlot(i);
    if (!reduced()) gsap.fromTo(el, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.45)" });
  }

  const s = SERVICES.find((x) => x.id === service);
  const p = PRACTITIONERS.find((x) => x.id === prac);
  const d = DAYS.find((x) => x.id === day);

  return (
    <div ref={rootRef} className={styles.site}>
      <header className={styles.nav}>
        <span className={styles.logo}>
          Tidewater<span>Physio</span>
        </span>
        <span className={styles.links}>
          <span>Services</span>
          <span>Team</span>
          <span>Fees</span>
        </span>
        <span className={styles.navBtn}>Book</span>
      </header>

      <div className={styles.main}>
        <div className={styles.copy}>
          <p className={styles.h1}>
            Move well.
            <br />
            <em>Live well.</em>
          </p>
          <p className={styles.p}>
            Physiotherapy, clinical Pilates and dry needling — with health fund rebates on the spot.
          </p>
          <ul className={styles.chips}>
            <li>No referral needed</li>
            <li>HICAPS on site</li>
            <li>Free parking</li>
          </ul>
        </div>

        <div className={styles.booking} data-cursor="Book">
          <div className={styles.bookHead}>
            <span>Book online</span>
            <span className={styles.bookMeta}>{s.mins} min</span>
          </div>

          <div className={styles.group} role="radiogroup" aria-label="Appointment type">
            {SERVICES.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={service === x.id}
                className={`${styles.seg}${service === x.id ? ` ${styles.on}` : ""}`}
                onClick={() => setService(x.id)}
              >
                {x.name}
              </button>
            ))}
          </div>

          <div className={styles.pracs} role="radiogroup" aria-label="Practitioner">
            {PRACTITIONERS.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={prac === x.id}
                className={`${styles.prac}${prac === x.id ? ` ${styles.on}` : ""}`}
                onClick={() => setPrac(x.id)}
              >
                <span className={styles.avatar}>{x.initials}</span>
                {x.name}
              </button>
            ))}
          </div>

          <div className={styles.days} role="radiogroup" aria-label="Day">
            {DAYS.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={day === x.id}
                className={`${styles.day}${day === x.id ? ` ${styles.on}` : ""}`}
                onClick={() => setDay(x.id)}
              >
                <small>{x.short}</small>
                {x.date}
              </button>
            ))}
          </div>

          <div ref={slotsRef} className={styles.slots}>
            {TIMES.map((t, i) => {
              const taken = isTaken(prac, day, i);
              return (
                <button
                  key={t}
                  type="button"
                  disabled={taken}
                  aria-pressed={slot === i}
                  className={`${styles.slot}${slot === i ? ` ${styles.on}` : ""}`}
                  onClick={(e) => pickSlot(i, e.currentTarget)}
                >
                  {taken ? "—" : t}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.confirm}
            disabled={slot === null}
            onClick={() => {
              setConfirmed({ day: d, time: TIMES[slot], prac: p, service: s });
              setBooked(true);
            }}
          >
            {slot === null ? "Choose a time" : `Book ${d.short} ${TIMES[slot]} with ${p.name} →`}
          </button>

          <div ref={doneRef} className={styles.done} aria-live="polite">
            <svg viewBox="0 0 48 48" className={styles.doneIcon} aria-hidden="true">
              <circle cx="24" cy="24" r="22" />
              <path ref={tickRef} d="M14 25 L21 32 L34 17" />
            </svg>
            {confirmed && (
              <>
                <p className={styles.doneTitle}>You&apos;re booked in</p>
                <p className={styles.doneText}>
                  {confirmed.day.short} {confirmed.day.date} · {confirmed.time} with {confirmed.prac.name}
                  <br />
                  {confirmed.service.name} · {confirmed.service.mins} min
                </p>
                <p className={styles.doneSms}>Confirmation sent by SMS</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
