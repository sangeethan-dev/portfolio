"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { setScrollLocked, scrollToSection } from "@/lib/lenis/useLenis";
import useScramble from "@/lib/gsap/useScramble";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { nav, offerLine } from "@/content/site";
import styles from "./Header.module.css";

function go(href) {
  scrollToSection(href, 0);
}

function NavLink({ label, href, onNavigate }) {
  const textRef = useScramble({ duration: 0.5 });
  return (
    <a
      href={href}
      className={styles.link}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(href);
      }}
    >
      <span ref={textRef}>{label}</span>
    </a>
  );
}

export default function Header() {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const menuTl = useRef(null);
  const ctaRef = useMagnetic(0.3);
  const [open, setOpen] = useState(false);

  /* ── Hide on scroll down, reveal on scroll up ────────────────── */
  useEffect(() => {
    const header = headerRef.current;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate(self) {
        const hide = self.direction === 1 && self.scroll() > 240;
        gsap.to(header, {
          yPercent: hide ? -110 : 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      },
    });
    return () => st.kill();
  }, []);

  /* ── Mobile menu timeline ─────────────────────────────────────── */
  useEffect(() => {
    const menu = menuRef.current;
    const links = menu.querySelectorAll("[data-menu-item]");
    const reduced = window.matchMedia(MQ.reduced).matches;

    gsap.set(menu, { autoAlpha: 0, clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(links, { yPercent: 120 });

    menuTl.current = gsap
      .timeline({ paused: true })
      .to(menu, {
        autoAlpha: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: reduced ? 0 : 0.7,
        ease: "expo.inOut",
      })
      .to(
        links,
        { yPercent: 0, duration: reduced ? 0 : 0.8, ease: "expo.out", stagger: 0.06 },
        "-=0.3"
      );

    return () => menuTl.current && menuTl.current.kill();
  }, []);

  const mounted = useRef(false);
  useEffect(() => {
    const tl = menuTl.current;
    // skip the mount run so we never unlock scroll the preloader locked
    if (!tl || !mounted.current) {
      mounted.current = true;
      return;
    }

    if (open) {
      tl.timeScale(1).play();
      setScrollLocked(true);
    } else {
      tl.timeScale(1.6).reverse();
      setScrollLocked(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function navigate(href) {
    setOpen(false);
    // let the menu start closing / lenis restart before scrolling
    requestAnimationFrame(() => go(href));
  }

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <a
          href="#top"
          className={styles.brand}
          onClick={(e) => {
            e.preventDefault();
            navigate("#top");
          }}
        >
          Sangeethan<span className={styles.brandMark}>®</span>
          <span className={styles.brandRole}>/ creative dev</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {nav.map((l) => (
            <NavLink key={l.href} {...l} onNavigate={navigate} />
          ))}
        </nav>

        <a
          ref={ctaRef}
          href="#contact"
          className={styles.cta}
          onClick={(e) => {
            e.preventDefault();
            navigate("#contact");
          }}
        >
          <span data-magnetic-inner>Start a project</span>
        </a>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={styles.menu}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className={styles.menuNav} aria-label="Mobile">
          {nav.map((l, i) => (
            <span key={l.href} className={styles.menuMask}>
              <a
                href={l.href}
                data-menu-item
                className={styles.menuLink}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(l.href);
                }}
              >
                <span className={styles.menuNum}>0{i + 1}</span>
                {l.label}
              </a>
            </span>
          ))}
        </nav>
        <p className={styles.menuFoot}>{offerLine}</p>
      </div>
    </>
  );
}
