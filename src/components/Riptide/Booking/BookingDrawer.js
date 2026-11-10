"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsap";
import { booking, clinic, team } from "@/content/riptide";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import styles from "./BookingDrawer.module.css";

const STEPS = ["Appointment", "Physio", "Time", "Details"];

const practitioners = [
  { id: "any", name: booking.anyone, role: "Soonest appointment with any physio" },
  ...team.cast.map((c) => ({ id: c.id, name: c.name, role: c.specialty, img: c.img })),
  ...team.alsoStarring.map((c) => ({ id: c.name.split(" ")[0].toLowerCase(), name: c.name, role: c.role })),
];

/* Next 6 open days with a believable spread of free times (stable per day) */
function buildDays() {
  const out = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (out.length < 6) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow === 0) continue;
    const seed = d.getDate() * 7 + d.getMonth() * 31;
    const base =
      dow === 6
        ? ["7:00am", "7:45am", "8:30am", "9:15am", "10:00am", "11:30am"]
        : ["6:00am", "6:45am", "7:30am", "9:00am", "10:30am", "12:15pm", "2:00pm", "3:30pm", "4:45pm", "5:30pm", "6:15pm", "7:00pm"];
    const times = base.filter((_, i) => (seed + i * 5) % 3 !== 0);
    out.push({
      key: d.toISOString().slice(0, 10),
      dow: d.toLocaleDateString("en-AU", { weekday: "short" }),
      date: d.toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
      long: d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" }),
      times,
    });
  }
  return out;
}

export default function BookingDrawer({ open, preset, onClose }) {
  const [step, setStep] = useState(0);
  const [type, setType] = useState(null);
  const [who, setWho] = useState(null);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(null);
  const [form, setForm] = useState({ first: "", last: "", mobile: "", email: "" });
  const [done, setDone] = useState(false);
  const bodyRef = useRef(null);
  const days = useMemo(() => (open ? buildDays() : []), [open]);

  // Each open starts fresh, jumping ahead past anything already chosen
  useEffect(() => {
    if (!open) return;
    const t = preset?.type ? booking.types.find((x) => x.id === preset.type) : null;
    const p = preset?.practitioner ? practitioners.find((x) => x.id === preset.practitioner) : null;
    setType(t || null);
    setWho(p || null);
    setDay(0);
    setTime(null);
    setDone(false);
    setStep(t ? (p ? 2 : 1) : 0);
  }, [open, preset]);

  // Slide the step content in
  useEffect(() => {
    if (!open || !bodyRef.current) return;
    if (!window.matchMedia(MQ.motion).matches) return;
    gsap.fromTo(
      bodyRef.current.children,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.04 }
    );
  }, [step, done, open]);

  const canSubmit = form.first.trim() && form.mobile.replace(/\D/g, "").length >= 8;

  function submit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    // Concept build: nothing leaves the browser.
    setDone(true);
  }

  const chosenDay = days[day];

  return (
    <Drawer open={open} onClose={onClose} label="Book an appointment">
      <div className={styles.head}>
        <p className={styles.kicker}>
          {preset?.returning ? "Welcome back" : "Online booking"} · {clinic.suburb}
        </p>
        <h2 className={styles.title}>{done ? "You’re booked in" : "Book an appointment"}</h2>
        {preset?.reason && !done && (
          <p className={styles.reason}>
            Booking for: <strong>{preset.reason}</strong>
          </p>
        )}
        {!done && (
          <ol className={styles.steps} aria-label="Booking steps">
            {STEPS.map((s, i) => (
              <li key={s} className={i === step ? styles.stepOn : i < step ? styles.stepDone : ""}>
                <button type="button" disabled={i > step} onClick={() => i < step && setStep(i)}>
                  <span>{String(i + 1).padStart(2, "0")}</span> {s}
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div ref={bodyRef} className={styles.body}>
        {done ? (
          <>
            <div className={styles.ticket}>
              <p className={styles.ticketLabel}>Confirmed</p>
              <p className={styles.ticketMain}>{type?.name}</p>
              <p>
                {chosenDay?.long} · {time}
              </p>
              <p>with {who?.id === "any" ? "the first available physio" : who?.name}</p>
              <p className={styles.ticketAddr}>{clinic.address.join(", ")}</p>
            </div>
            <p className={styles.note}>
              Thanks {form.first}. A confirmation and reminder will be texted to {form.mobile}. Wear something comfortable
              you can move in, and arrive 5 minutes early.
            </p>
            <Button variant="ghost" icon={null} onClick={onClose}>
              Done
            </Button>
          </>
        ) : step === 0 ? (
          <>
            <p className={styles.q}>What would you like to book?</p>
            <div className={styles.list}>
              {booking.types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.option} ${type?.id === t.id ? styles.optionOn : ""}`}
                  onClick={() => {
                    setType(t);
                    setStep(who ? 2 : 1);
                  }}
                >
                  <span className={styles.optMain}>
                    <strong>{t.name}</strong>
                    <span>{t.note}</span>
                  </span>
                  <span className={styles.optMeta}>
                    {t.time}
                    <strong>{t.price}</strong>
                  </span>
                </button>
              ))}
            </div>
            <p className={styles.small}>No referral needed. Claim on the spot with HICAPS.</p>
          </>
        ) : step === 1 ? (
          <>
            <p className={styles.q}>Who would you like to see?</p>
            <div className={styles.list}>
              {practitioners.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.option} ${who?.id === p.id ? styles.optionOn : ""}`}
                  onClick={() => {
                    setWho(p);
                    setStep(2);
                  }}
                >
                  <span className={styles.person}>
                    {p.img ? (
                      <img src={p.img} alt="" className={styles.avatar} />
                    ) : (
                      <span className={styles.avatarBlank} aria-hidden="true">
                        {p.id === "any" ? "★" : p.name[0]}
                      </span>
                    )}
                    <span className={styles.optMain}>
                      <strong>{p.name}</strong>
                      <span>{p.role}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : step === 2 ? (
          <>
            <p className={styles.q}>Pick a time</p>
            <div className={styles.days} role="tablist" aria-label="Day">
              {days.map((d, i) => (
                <button
                  key={d.key}
                  type="button"
                  role="tab"
                  aria-selected={i === day}
                  className={`${styles.day} ${i === day ? styles.dayOn : ""}`}
                  onClick={() => {
                    setDay(i);
                    setTime(null);
                  }}
                >
                  <span>{d.dow}</span>
                  <strong>{d.date}</strong>
                </button>
              ))}
            </div>
            <div className={styles.times}>
              {chosenDay?.times.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.time} ${time === t ? styles.timeOn : ""}`}
                  onClick={() => {
                    setTime(t);
                    setStep(3);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className={styles.small}>
              {type?.name} · {type?.time} · {who?.name}
            </p>
          </>
        ) : (
          <form className={styles.form} onSubmit={submit}>
            <div className={styles.summary}>
              <strong>{type?.name}</strong>
              <span>
                {chosenDay?.long} at {time}
              </span>
              <span>{who?.id === "any" ? "First available physio" : `with ${who?.name}`}</span>
            </div>
            <div className={styles.row}>
              <label>
                <span>First name</span>
                <input
                  required
                  autoComplete="given-name"
                  value={form.first}
                  onChange={(e) => setForm({ ...form, first: e.target.value })}
                />
              </label>
              <label>
                <span>Last name</span>
                <input
                  autoComplete="family-name"
                  value={form.last}
                  onChange={(e) => setForm({ ...form, last: e.target.value })}
                />
              </label>
            </div>
            <label>
              <span>Mobile</span>
              <input
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <Button variant="solid" size="lg" type="submit" disabled={!canSubmit}>
              Confirm booking
            </Button>
            <p className={styles.small}>
              Free to cancel or move up to 24 hours before. Prefer to talk? Call{" "}
              <a href={clinic.phoneHref}>{clinic.phone}</a>.
            </p>
          </form>
        )}
      </div>
    </Drawer>
  );
}
