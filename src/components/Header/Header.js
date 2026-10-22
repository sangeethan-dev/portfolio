"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";
import { setScrollLocked } from "@/lib/lenis/useLenis";
import useSectionNav, { sectionHref } from "@/lib/lenis/useSectionNav";
import useScramble from "@/lib/gsap/useScramble";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { nav, agencyNav, offerLine, agencyLine } from "@/content/site";
import styles from "./Header.module.css";

function NavLink({ label, href, pathname, onNavigate }) {
  const textRef = useScramble({ duration: 0.5 });
  return (
    <a href={sectionHref(href, pathname)} className={styles.link} onClick={(e) => onNavigate(href, e)}>
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
  const pathname = usePathname();
  const go = useSectionNav();
  const onAgencies = pathname.startsWith("/agencies");
  const links = onAgencies ? agencyNav : nav;
  // /agencies is shared directly, never linked from the main site; its own
  // mobile menu links back home (the desktop nav does not)
  const menuLinks = onAgencies ? [...links, { label: "Home", href: "/" }] : links;

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
    // rebuild when the route swaps the menu's links
  }, [onAgencies]);

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

  // close the menu if a link took us to another page
  useEffect(() => setOpen(false), [pathname]);

  function navigate(href, e) {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey)) return;
    if (e) e.preventDefault();
    setOpen(false);
    // let the menu start closing / lenis restart before scrolling
    requestAnimationFrame(() => go(href));
  }

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <a
          href={pathname === "/" ? "#top" : "/"}
          className={styles.brand}
          onClick={(e) => navigate(pathname === "/" ? "#top" : "/", e)}
        >
          Sangeethan<span className={styles.brandMark}>®</span>
          <span className={styles.brandRole}>/ creative dev</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.href} {...l} pathname={pathname} onNavigate={navigate} />
          ))}
        </nav>

        <a
          ref={ctaRef}
          href={sectionHref("#contact", pathname)}
          className={styles.cta}
          onClick={(e) => navigate("#contact", e)}
        >
          <span data-magnetic-inner>{onAgencies ? "Let's talk" : "Start a project"}</span>
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
          {menuLinks.map((l, i) => (
            <span key={l.href} className={styles.menuMask}>
              <a
                href={sectionHref(l.href, pathname)}
                data-menu-item
                className={`${styles.menuLink}${l.href.startsWith("/") ? ` ${styles.menuPage}` : ""}`}
                onClick={(e) => navigate(l.href, e)}
              >
                <span className={styles.menuNum}>0{i + 1}</span>
                {l.label}
                {l.href.startsWith("/") && <span aria-hidden="true"> →</span>}
              </a>
            </span>
          ))}
        </nav>
        <p className={styles.menuFoot}>{onAgencies ? agencyLine : offerLine}</p>
      </div>
    </>
  );
}
