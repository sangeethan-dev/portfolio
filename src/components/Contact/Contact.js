"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Contact.module.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  "WordPress",
  "Shopify",
  "Landing Page",
  "Next.js Frontend",
  "Other",
];

const headlineWords = [
  { text: "Let's" },
  { text: "build" },
  { text: "something" },
  { text: "great.", em: true },
];


export default function Contact() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const wordRefs    = useRef([]);
  const subRef      = useRef(null);
  const fieldRefs   = useRef([]);
  const btnRef      = useRef(null);
  const dropdownRef = useRef(null);

  const [focusedField, setFocusedField] = useState(null);
  const [dropOpen,     setDropOpen]     = useState(false);
  const [service,      setService]      = useState(null);
  const [kbIdx,        setKbIdx]        = useState(-1);
  const [formState,    setFormState]    = useState("idle"); // idle | submitting | success | error

  /* ── Close dropdown on outside click ─────────────────────────── */
  useEffect(() => {
    function onDoc(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  /* ── GSAP entrance ────────────────────────────────────────────── */
  useEffect(() => {
    const words  = wordRefs.current.filter(Boolean);
    const fields = fieldRefs.current.filter(Boolean);

    gsap.set(labelRef.current, { opacity: 0, y: 24 });
    gsap.set(words,            { opacity: 0.15 });
    gsap.set(subRef.current,   { opacity: 0, y: 24 });
    gsap.set(fields,           { opacity: 0, y: 16 });
    gsap.set(btnRef.current,   { opacity: 0, scale: 0.95 });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   "top 80%",
      once:    true,
      onEnter() {
        gsap.to(labelRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        });
        gsap.to(words, {
          opacity: 1, duration: 0.6, ease: "power2.out",
          stagger: 0.1, delay: 0.2,
        });
        gsap.to(subRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.5,
        });
        gsap.to(fields, {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          stagger: 0.1, delay: 0.7,
        });
        gsap.to(btnRef.current, {
          opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)", delay: 1.3,
        });
      },
    });

    return () => st.kill();
  }, []);

  /* ── Dropdown keyboard nav ────────────────────────────────────── */
  function handleDropKey(e) {
    if (!dropOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setDropOpen(true);
        setKbIdx(0);
      }
      return;
    }
    switch (e.key) {
      case "Escape":
        setDropOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setKbIdx((i) => Math.min(i + 1, services.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setKbIdx((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (kbIdx >= 0) selectService(services[kbIdx]);
        break;
    }
  }

  function selectService(val) {
    setService(val);
    setDropOpen(false);
    setKbIdx(-1);
  }

  /* ── Form submission ──────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (formState === "submitting") return;
    setFormState("submitting");

    const form = e.target;
    const body = {
      name:    form.elements["name"].value.trim(),
      email:   form.elements["email"].value.trim(),
      service: service || "",
      message: form.elements["message"].value.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      setFormState(res.ok ? "success" : "error");
    } catch {
      setFormState("error");
    }
  }

  const isSubmitting = formState === "submitting";

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className="container">
        <div className={styles.card}>

          {/* ── Header ─────────────────────────────────────────── */}
          <div className={styles.header}>
            <span ref={labelRef} className={styles.label}>Contact</span>
            <h2 className={styles.headline}>
              {headlineWords.map((w, i) => (
                <span
                  key={i}
                  ref={(el) => (wordRefs.current[i] = el)}
                  className={w.em ? `${styles.word} ${styles.wordEm}` : styles.word}
                >
                  {w.text}
                </span>
              ))}
            </h2>
            <p ref={subRef} className={styles.sub}>
              Have a project in mind? Let&apos;s talk.<br />
              I reply within 24 hours.
            </p>
          </div>

          {/* ── Success state ──────────────────────────────────── */}
          {formState === "success" ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>
                <svg viewBox="0 0 24 24" fill="none" width={22} height={22}>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={styles.successTitle}>Message sent.</p>
              <p className={styles.successSub}>
                I&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (

          /* ── Form ──────────────────────────────────────────── */
          <form onSubmit={handleSubmit} className={styles.form} noValidate>


            {/* Name */}
            <div
              ref={(el) => (fieldRefs.current[0] = el)}
              className={`${styles.field}${focusedField === "name" ? ` ${styles.focused}` : ""}`}
            >
              <label htmlFor="c-name" className={styles.fieldLabel}>Name</label>
              <input
                id="c-name"
                name="name"
                type="text"
                placeholder="Your name"
                required
                disabled={isSubmitting}
                className={styles.control}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Email */}
            <div
              ref={(el) => (fieldRefs.current[1] = el)}
              className={`${styles.field}${focusedField === "email" ? ` ${styles.focused}` : ""}`}
            >
              <label htmlFor="c-email" className={styles.fieldLabel}>Email</label>
              <input
                id="c-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
                className={styles.control}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Dropdown — full width, z-index lifted when open */}
            <div
              ref={(el) => (fieldRefs.current[2] = el)}
              className={[
                styles.field,
                styles.full,
                dropOpen ? styles.focused    : "",
                dropOpen ? styles.dropAbove  : "",
              ].join(" ").trim()}
            >
              <label className={styles.fieldLabel}>Project type</label>

              <div
                ref={dropdownRef}
                className={`${styles.control} ${styles.dropdown}${dropOpen ? ` ${styles.dropOpen}` : ""}`}
                role="combobox"
                aria-expanded={dropOpen}
                aria-haspopup="listbox"
                aria-label="Select a service"
                tabIndex={0}
                onClick={() => !isSubmitting && setDropOpen((o) => !o)}
                onKeyDown={handleDropKey}
              >
                <span className={`${styles.dropVal}${service ? ` ${styles.dropSelected}` : ""}`}>
                  {service ?? "Select a service"}
                </span>

                <svg
                  className={styles.dropChevron}
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 5l5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div
                  className={`${styles.dropMenu}${dropOpen ? ` ${styles.dropMenuOpen}` : ""}`}
                  role="listbox"
                >
                  {services.map((opt, i) => (
                    <div
                      key={opt}
                      role="option"
                      aria-selected={service === opt}
                      className={[
                        styles.dropOpt,
                        service === opt ? styles.dropOptActive : "",
                        kbIdx === i    ? styles.dropOptKb     : "",
                      ].join(" ").trim()}
                      onMouseDown={(e) => { e.stopPropagation(); selectService(opt); }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Message — full width */}
            <div
              ref={(el) => (fieldRefs.current[3] = el)}
              className={`${styles.field} ${styles.full}${focusedField === "msg" ? ` ${styles.focused}` : ""}`}
            >
              <label htmlFor="c-msg" className={styles.fieldLabel}>Message</label>
              <textarea
                id="c-msg"
                name="message"
                placeholder="Tell me about your project..."
                required
                disabled={isSubmitting}
                className={`${styles.control} ${styles.textarea}`}
                onFocus={() => setFocusedField("msg")}
                onBlur={() => setFocusedField(null)}
              />
            </div>

            {/* Submit + error */}
            <div className={styles.submitWrap}>
              {formState === "error" && (
                <p className={styles.errorMsg}>
                  Something went wrong. Email me at{" "}
                  <a href="mailto:email2geethan@gmail.com">email2geethan@gmail.com</a>
                </p>
              )}
              <button
                ref={btnRef}
                type="submit"
                disabled={isSubmitting}
                className={`${styles.btn}${isSubmitting ? ` ${styles.btnBusy}` : ""}`}
              >
                {isSubmitting ? "Sending…" : "Send message"}
              </button>
            </div>

          </form>
          )}

        </div>
      </div>
    </section>
  );
}
