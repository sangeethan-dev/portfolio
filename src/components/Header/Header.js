"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Button from "@/components/Button/Button";
import { getLenis } from "@/lib/lenis/useLenis";
import styles from "./Header.module.css";

const navLinks = [
  { label: "Lab",      href: "#lab"      },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about"    },
  { label: "Process",  href: "#process"  },
];

export default function Header() {
  const pillRef        = useRef(null);
  const menuRef        = useRef(null);
  const menuLinksRef   = useRef([]);
  const progressRef    = useRef(null);

  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen,      setMenuOpen]      = useState(false);

  /* ── Scroll state + progress bar ─────────────────────────────── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current && total > 0) {
        progressRef.current.style.width = (window.scrollY / total * 100) + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Active section via IntersectionObserver ──────────────────── */
  useEffect(() => {
    const ids = ["lab", "services", "about", "process"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── GSAP entrance ────────────────────────────────────────────── */
  useEffect(() => {
    gsap.fromTo(
      pillRef.current,
      { opacity: 0, y: -20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out", delay: 0.3 }
    );
    gsap.set(menuRef.current, { display: "none" });
  }, []);

  /* ── Mobile menu open / close ────────────────────────────────── */
  function openMenu() {
    setMenuOpen(true);
    const links = menuLinksRef.current.filter(Boolean);
    gsap.set(menuRef.current, { display: "flex" });
    gsap.fromTo(menuRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
    gsap.fromTo(links,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.07, delay: 0.1 }
    );
  }

  function closeMenu() {
    const links = menuLinksRef.current.filter(Boolean);
    gsap.to(links, { opacity: 0, y: -20, duration: 0.25, ease: "power2.in", stagger: 0.04 });
    gsap.to(menuRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      ease: "power2.in",
      onComplete() {
        gsap.set(menuRef.current, { display: "none" });
        setMenuOpen(false);
      },
    });
  }

  /* ── Scroll helpers ───────────────────────────────────────────── */
  function scrollToSection(href) {
    const target = document.querySelector(href);
    if (!target) return;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(target, { offset: -90, duration: 1.4 });
    } else {
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  }

  function scrollToTop() {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleLinkClick(e, href) {
    e.preventDefault();
    scrollToSection(href);
    if (menuOpen) closeMenu();
  }

  return (
    <>
      <header className={styles.header}>
        {/* Progress bar */}
        <div ref={progressRef} className={styles.progressBar} />

        <div className={styles.wrap}>
          <nav
            ref={pillRef}
            className={`${styles.pill}${scrolled ? ` ${styles.scrolled}` : ""}`}
          >
            {/* Logo */}
            <span
              className={styles.logo}
              onClick={scrollToTop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollToTop()}
            >
              Sangeethan
            </span>

            {/* Desktop links */}
            <div className={styles.links}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${styles.link}${activeSection === link.href.slice(1) ? ` ${styles.active}` : ""}`}
                  onClick={(e) => handleLinkClick(e, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right — availability + CTA + hamburger */}
            <div className={styles.right}>
              <div className={styles.avail}>
                <span className={styles.dot} />
                Available
              </div>

              <Button
                variant="primary"
                className={styles.cta}
                onClick={() => scrollToSection("#contact")}
              >
                Let&apos;s talk
              </Button>

              <button
                className={`${styles.hamburger}${menuOpen ? ` ${styles.hamburgerOpen}` : ""}`}
                onClick={menuOpen ? closeMenu : openMenu}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div ref={menuRef} className={styles.mobileMenu}>
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            ref={(el) => (menuLinksRef.current[i] = el)}
            className={styles.mobileLink}
            onClick={(e) => handleLinkClick(e, link.href)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
