"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import { scrollToSection, setScrollLocked } from "@/lib/lenis/useLenis";
import { clinic, nav } from "@/content/riptide";
import { useBooking } from "../Booking/BookingContext";
import Button, { Phone } from "../ui/Button";
import styles from "./Nav.module.css";

export function Logo({ className = "" }) {
  return (
    <span className={`${styles.logo} ${className}`}>
      <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true" className={styles.mark}>
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M6 25c4.2 0 6-2.6 8-6.2 2.3-4.2 5-7.3 10-7.3 4.4 0 7.2 2.8 7.2 6.2 0 2.7-2 4.6-4.4 4.6-1.9 0-3.3-1.2-3.3-3 0-1.2.8-2.1 1.9-2.3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M6 30.5c3 0 4.5-1.4 7-1.4s4 1.4 7 1.4 4.5-1.4 7-1.4 4 1.4 7 1.4" className={styles.markWave} fill="none" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className={styles.word}>
        <strong>Riptide</strong>
        <span>Physio &amp; Performance</span>
      </span>
    </span>
  );
}

export default function Nav() {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const { open } = useBooking();

  /* Solid once past the hero's letterbox bar; tucks away on scroll down */
  useGSAP(() => {
    const el = navRef.current;
    const solid = ScrollTrigger.create({
      start: 80,
      end: "max",
      toggleClass: { targets: el, className: styles.solid },
    });
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const hideTo = gsap.quickTo(el, "yPercent", { duration: 0.45, ease: "power3.out" });
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.9,
        end: "max",
        onUpdate: (self) => hideTo(self.direction === 1 ? -110 : 0),
        onLeaveBack: () => hideTo(0),
      });
    });
    return () => {
      solid.kill();
      mm.revert();
    };
  });

  /* Phone menu */
  useEffect(() => {
    const m = menuRef.current;
    const reduced = window.matchMedia(MQ.reduced).matches;
    setScrollLocked(menu);
    m.inert = !menu;
    if (menu) {
      gsap.set(m, { visibility: "visible" });
      gsap.fromTo(m, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0 : 0.7, ease: "expo.out" });
      gsap.fromTo(
        m.querySelectorAll("li"),
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: reduced ? 0 : 0.7, ease: "expo.out", stagger: 0.05, delay: reduced ? 0 : 0.1 }
      );
    } else {
      gsap.to(m, {
        clipPath: "inset(0 0 100% 0)",
        duration: reduced ? 0 : 0.45,
        ease: "power3.in",
        onComplete: () => gsap.set(m, { visibility: "hidden" }),
      });
    }
  }, [menu]);

  function go(href, e) {
    e.preventDefault();
    setMenu(false);
    requestAnimationFrame(() => scrollToSection(href, href === "#top" ? 0 : -8));
  }

  return (
    <>
      <header ref={navRef} className={styles.nav}>
        <div className={styles.inner}>
          <a href="#top" className={styles.home} onClick={(e) => go("#top", e)} aria-label={`${clinic.name}, back to top`}>
            <Logo />
          </a>

          <nav className={styles.links} aria-label="Main">
            {nav.map((l) => (
              <a key={l.href} href={l.href} onClick={(e) => go(l.href, e)}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <a href={clinic.phoneHref} className={styles.call}>
              <Phone />
              <span>{clinic.phone}</span>
            </a>
            <Button size="sm" onClick={() => open({})} className={styles.book}>
              Book now
            </Button>
            <button
              type="button"
              className={styles.burger}
              aria-expanded={menu}
              aria-controls="rt-menu"
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu((v) => !v)}
            >
              <span className={menu ? styles.x : ""} />
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} id="rt-menu" className={styles.menu}>
        <ul>
          {nav.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => go(l.href, e)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.menuFoot}>
          <p>{clinic.address.join(", ")}</p>
          <p>Mon–Fri from 6am · Sat 7am–12:30pm</p>
          <a href={clinic.phoneHref}>{clinic.phone}</a>
        </div>
      </div>
    </>
  );
}
