"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MQ } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { SCRAMBLE_CHARS } from "@/lib/gsap/useScramble";
import { onSelectService } from "@/lib/enquiry";
import { contact, serviceOptions } from "@/content/site";
import styles from "./Contact.module.css";

const LABELS = {
  idle: "Send enquiry →",
  sending: "Deploying…",
  sent: "Live ✓ Message sent",
  error: "Failed — try again",
};

export default function Contact() {
  const rootRef = useRef(null);
  const btnTextRef = useRef(null);
  const barRef = useRef(null);
  const titleRef = useSplitReveal({ type: "chars", stagger: 0.02 });
  const btnRef = useMagnetic(0.2);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "", company: "" });

  /* CTAs elsewhere on the page can preselect a package */
  useEffect(
    () =>
      onSelectService((value) => {
        setForm((f) => ({ ...f, service: value }));
        const flash = rootRef.current.querySelector("[data-flash]");
        if (flash && !window.matchMedia(MQ.reduced).matches) {
          gsap.fromTo(flash, { autoAlpha: 0.4 }, { autoAlpha: 0, duration: 1.6, delay: 1 });
        }
      }),
    []
  );

  /* Button label + progress bar follow the status */
  useEffect(() => {
    const reduced = window.matchMedia(MQ.reduced).matches;
    if (reduced) {
      btnTextRef.current.textContent = LABELS[status];
    } else {
      gsap.to(btnTextRef.current, {
        duration: 0.5,
        scrambleText: { text: LABELS[status], chars: SCRAMBLE_CHARS, speed: 0.8 },
        overwrite: true,
      });
    }
    const bar = barRef.current;
    gsap.killTweensOf(bar);
    if (status === "sending") {
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 0.85, duration: reduced ? 0 : 3, ease: "power2.out" });
    } else if (status === "sent") {
      gsap.to(bar, { scaleX: 1, duration: reduced ? 0 : 0.3 });
    } else {
      gsap.to(bar, { scaleX: 0, duration: reduced ? 0 : 0.3 });
    }
  }, [status]);

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (status === "error") setStatus("idle");
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    // honeypot — bots fill every field
    if (form.company) {
      setTimeout(() => setStatus("sent"), 800);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          service: form.service,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setForm({ name: "", email: "", service: "", message: "", company: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" ref={rootRef} className={styles.section} data-theme-section="blueprint">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <span className="label">Fig. 08 — Contact</span>
          <h2 ref={titleRef} className={styles.title}>
            Let&apos;s build <span className={styles.accent}>yours.</span>
          </h2>
          <p className={styles.sub}>
            Tell me a little about your practice and what you&apos;d like your website to do. I&apos;ll reply
            within 24 hours with honest advice and next steps.
          </p>

          <ul className={styles.direct}>
            <li>
              <a href={`mailto:${contact.email}`} className={styles.directLink} data-cursor="Email">
                <span className={styles.directLabel}>Email</span>
                <span className={styles.directValue}>{contact.email}</span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
            <li>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directLink}
                data-cursor="Chat"
              >
                <span className={styles.directLabel}>WhatsApp</span>
                <span className={styles.directValue}>{contact.phoneDisplay}</span>
                <span className={styles.arrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.formHead}>
            <span>new-enquiry.form</span>
            <span className={styles.formStatus} data-status={status}>
              ● {status === "sent" ? "delivered" : status === "error" ? "error" : status === "sending" ? "sending" : "ready"}
            </span>
          </div>

          <div className={styles.row}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>01 · Your name</span>
              <input name="name" required autoComplete="name" value={form.name} onChange={update} placeholder="Jane Citizen" />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>02 · Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update}
                placeholder="jane@yourpractice.com.au"
              />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>03 · What do you need?</span>
            <span className={styles.flash} data-flash aria-hidden="true" />
            <select name="service" value={form.service} onChange={update}>
              <option value="">Choose a package (optional)</option>
              {serviceOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>04 · Tell me about your practice</span>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={update}
              placeholder="What you do, who you help, and what you'd like the website to achieve — more bookings, a fresh look, easier updates…"
            />
          </label>

          {/* honeypot */}
          <label className={styles.hp} aria-hidden="true">
            Company
            <input name="company" tabIndex={-1} autoComplete="off" value={form.company} onChange={update} />
          </label>

          <div className={styles.submitRow}>
            <button
              ref={btnRef}
              type="submit"
              className={styles.submit}
              data-status={status}
              disabled={status === "sending"}
            >
              <span className={styles.bar} ref={barRef} aria-hidden="true" />
              <span data-magnetic-inner className={styles.submitInner}>
                <span ref={btnTextRef}>{LABELS.idle}</span>
              </span>
            </button>
            <p className={styles.feedback} role="status" aria-live="polite">
              {status === "sent" && "Thanks — your message is in my inbox. I'll be in touch within 24 hours."}
              {status === "error" && (
                <>
                  Something went wrong sending that. Email me directly at{" "}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>.
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
