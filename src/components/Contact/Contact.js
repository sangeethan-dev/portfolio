"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, MQ } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { SCRAMBLE_CHARS } from "@/lib/gsap/useScramble";
import { onSelectService } from "@/lib/enquiry";
import { contact, serviceOptions, agency, pageLinks } from "@/content/site";
import styles from "./Contact.module.css";

const LABELS = {
  idle: "Send enquiry →",
  sending: "Deploying…",
  sent: "Live ✓ Message sent",
  error: "Failed — try again",
};

const EMPTY = { name: "", email: "", service: "", message: "", company: "", agencyName: "", website: "" };

/* Copy per form. "agency" is the /agencies form (agency name, website, need). */
const VARIANTS = {
  home: {
    fig: "Fig. 10 — Contact",
    title: "Let's build",
    titleAccent: "yours.",
    sub: "Tell me a bit about your practice and what you want from your website. I'll get back to you within 24 hours with honest advice and what I'd suggest next.",
    serviceLabel: "What do you need?",
    servicePlaceholder: "Choose a package (optional)",
    options: serviceOptions,
    messageLabel: "Tell me about your practice",
    messagePlaceholder:
      "What you do, who you help, and what you'd like the website to do for you. More bookings? A fresh look? Easier updates?",
    emailPlaceholder: "jane@yourpractice.com.au",
    me: "No account managers or hand-offs. The person you talk to is the person who builds your site.",
    file: "new-enquiry.form",
  },
  agency: {
    fig: "Fig. 09 — Contact",
    title: "Let's work",
    titleAccent: "together.",
    sub: "Tell me about your agency and the work you have coming up. I'll reply within 24 hours with questions, a rough timeline and how I'd quote it.",
    serviceLabel: "What do you need?",
    servicePlaceholder: "Choose one",
    options: agency.needs,
    messageLabel: "Tell me about the work",
    messagePlaceholder: "The kind of projects, the stack you use, timelines, and how you like to work with developers.",
    emailPlaceholder: "jane@youragency.com.au",
    me: "No account managers or hand-offs. The person you brief is the person who builds it.",
    file: "agency-enquiry.form",
  },
};

export default function Contact({ variant = "home" }) {
  const copy = VARIANTS[variant];
  const isAgency = variant === "agency";
  const rootRef = useRef(null);
  const btnTextRef = useRef(null);
  const barRef = useRef(null);
  const titleRef = useSplitReveal({ type: "chars", stagger: 0.02 });
  const btnRef = useMagnetic(0.2);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState(EMPTY);

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
          source: variant,
          name: form.name,
          email: form.email,
          service: form.service,
          message: form.message,
          ...(isAgency && { agencyName: form.agencyName, website: form.website }),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      ref={rootRef}
      className={styles.section}
      data-theme-section="blueprint"
      data-theme-start="top 20%"
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <span className="label">{copy.fig}</span>
          <h2 ref={titleRef} className={styles.title}>
            {copy.title} <span className={styles.accent}>{copy.titleAccent}</span>
          </h2>
          <p className={styles.sub}>{copy.sub}</p>

          <div className={styles.me}>
            <Image
              src="/portfolio/profile-headshot.webp"
              alt="Sangeethan"
              width={112}
              height={112}
              className={styles.mephoto}
            />
            <p className={styles.meText}>
              <b>You&apos;ll be talking to me.</b>
              {copy.me}
            </p>
          </div>

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
            <span>{copy.file}</span>
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
                placeholder={copy.emailPlaceholder}
              />
            </label>
          </div>

          {isAgency && (
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>03 · Agency name</span>
                <input
                  name="agencyName"
                  required
                  autoComplete="organization"
                  value={form.agencyName}
                  onChange={update}
                  placeholder="Citizen Digital"
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>04 · Website</span>
                <input
                  name="website"
                  inputMode="url"
                  autoComplete="url"
                  value={form.website}
                  onChange={update}
                  placeholder="youragency.com.au"
                />
              </label>
            </div>
          )}

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {isAgency ? "05" : "03"} · {copy.serviceLabel}
            </span>
            <span className={styles.flash} data-flash aria-hidden="true" />
            <select name="service" value={form.service} onChange={update} required={isAgency}>
              <option value="">{copy.servicePlaceholder}</option>
              {copy.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>
              {isAgency ? "06" : "04"} · {copy.messageLabel}
            </span>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={update}
              placeholder={copy.messagePlaceholder}
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

          <p className={styles.privacy}>
            I only use your details to reply to this enquiry.{" "}
            <Link href={pageLinks.privacy.href}>Privacy policy</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
