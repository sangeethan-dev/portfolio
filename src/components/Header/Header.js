"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { getLenis } from "@/lib/lenis/useLenis";
import styles from "./Header.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Draggable);
}

const navLinks = [
  { label: "Lab",      href: "#lab"      },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about"    },
  { label: "Process",  href: "#process"  },
  { label: "Contact",  href: "#contact"  },
];

const sectionIds = navLinks.map((l) => l.href.slice(1));

const isDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 768px)").matches;

export default function Header() {
  const drawerRef    = useRef(null);
  const dropZoneRef  = useRef(null);
  const itemsRef     = useRef(null);
  const itemElsRef   = useRef([]);
  const togglerRef   = useRef(null);
  const draggableRef = useRef(null);

  const openRef       = useRef(false);
  const fullWidthRef  = useRef(0);
  const gapRef        = useRef(0);
  const reducedRef    = useRef(false);

  const [activeSection, setActiveSection] = useState("");

  /* ── Setup: measure, init Draggable, re-run across the breakpoint ── */
  useEffect(() => {
    const items   = itemsRef.current;
    const itemEls = itemElsRef.current.filter(Boolean);
    const drawer  = drawerRef.current;
    const dropZone = dropZoneRef.current;
    const desktopMql = window.matchMedia("(min-width: 768px)");

    const px = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    gapRef.current = 0.35 * px;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function teardown() {
      if (draggableRef.current) {
        draggableRef.current.kill();
        draggableRef.current = null;
      }
      gsap.killTweensOf([items, drawer, dropZone, ...itemEls]);
      gsap.set([items, drawer, dropZone], { clearProps: "all" });
      gsap.set(itemEls, { clearProps: "all" });
      drawer.classList.remove(styles.open);
      togglerRef.current.classList.remove(styles.close);
      openRef.current = false;
    }

    function setup() {
      teardown();

      if (desktopMql.matches) {
        // Measure natural width, then collapse
        gsap.set(items, { width: "auto", marginRight: 0, overflow: "visible" });
        fullWidthRef.current = items.offsetWidth;
        gsap.set(items, { width: 0, marginRight: 0, overflow: "hidden" });
        gsap.set(itemEls, { opacity: 0, scale: 0.85 });

        draggableRef.current = Draggable.create(drawer, {
          type: "x,y",
          dragClickables: true,
          minimumMovement: 4,
          cursor: "grab",
          activeCursor: "grabbing",
          onDragStart() {
            gsap.set(dropZone, { width: drawer.offsetWidth });
            gsap.to(dropZone, { opacity: 1, duration: 0.15 });
          },
          onDragEnd() {
            gsap.to(dropZone, { opacity: 0, duration: 0.15 });
            gsap.to(drawer, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
          },
        })[0];
      }
      // Mobile: items live in a CSS dropdown panel (.drawer.open .items) —
      // no measuring, no drag, no inline styles needed.
    }

    setup();

    const onBreakpoint = () => setup();
    desktopMql.addEventListener("change", onBreakpoint);

    // Re-measure once webfonts settle (Anton/JetBrains change widths)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          if (desktopMql.matches && !openRef.current) {
            gsap.set(items, { width: "auto", overflow: "visible" });
            fullWidthRef.current = items.offsetWidth;
            gsap.set(items, { width: 0, overflow: "hidden" });
          }
        })
        .catch(() => {});
    }

    return () => {
      desktopMql.removeEventListener("change", onBreakpoint);
      if (draggableRef.current) draggableRef.current.kill();
    };
  }, []);

  /* ── Open / close ─────────────────────────────────────────────── */
  function openMenu() {
    openRef.current = true;
    togglerRef.current.classList.add(styles.close);
    const reduced = reducedRef.current;

    if (isDesktop()) {
      const items = itemsRef.current;
      // Measure fresh each open so the last item is never clipped
      gsap.set(items, { width: "auto", overflow: "visible" });
      const full = items.offsetWidth;
      gsap.set(items, { width: 0, overflow: "hidden" });
      fullWidthRef.current = full;

      gsap.to(items, {
        width: full,
        marginRight: gapRef.current,
        duration: reduced ? 0 : 0.5,
        ease: "power3.inOut",
        onComplete() {
          // drop the clip once fully open — nothing can be cut off
          gsap.set(items, { overflow: "visible" });
        },
        onStart() {
          gsap.to(itemElsRef.current.filter(Boolean), {
            opacity: 1,
            scale: 1,
            duration: reduced ? 0 : 0.3,
            stagger: reduced ? 0 : 0.05,
            delay: reduced ? 0 : 0.15,
            ease: "power3.out",
          });
        },
      });
    } else {
      drawerRef.current.classList.add(styles.open);
    }
  }

  function closeMenu() {
    openRef.current = false;
    togglerRef.current.classList.remove(styles.close);
    const reduced = reducedRef.current;

    if (isDesktop()) {
      const items = itemsRef.current;
      gsap.set(items, { overflow: "hidden" }); // re-clip for the collapse
      gsap.to(items, {
        width: 0,
        marginRight: 0,
        duration: reduced ? 0 : 0.5,
        ease: "power3.inOut",
        onStart() {
          gsap.to(itemElsRef.current.filter(Boolean), {
            opacity: 0,
            scale: 0.85,
            duration: reduced ? 0 : 0.3,
            ease: "power3.out",
            stagger: reduced ? 0 : { each: 0.05, from: "end" },
          });
        },
      });
    } else {
      drawerRef.current.classList.remove(styles.open);
    }
  }

  function toggleMenu() {
    openRef.current ? closeMenu() : openMenu();
  }

  /* ── Close on outside click ───────────────────────────────────── */
  useEffect(() => {
    function onDoc(e) {
      if (openRef.current && drawerRef.current && !drawerRef.current.contains(e.target)) {
        closeMenu();
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  /* ── Active section via IntersectionObserver ──────────────────── */
  useEffect(() => {
    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

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
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleLinkClick(e, href) {
    e.preventDefault();
    scrollToSection(href);
    closeMenu();
  }

  return (
    <>
      {/* Brand — left */}
      <span
        className={styles.brand}
        onClick={scrollToTop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && scrollToTop()}
      >
        Sangeethan<span className={styles.brandDot}>.</span>
      </span>

      {/* Snap-back drop zone */}
      <div ref={dropZoneRef} className={styles.dropZone} aria-hidden="true" />

      {/* Menu pill — right */}
      <nav ref={drawerRef} className={styles.drawer}>
        <div ref={itemsRef} className={styles.items}>
          {navLinks.map((link, i) => (
            <div
              key={link.href}
              ref={(el) => (itemElsRef.current[i] = el)}
              className={`${styles.item}${
                activeSection === link.href.slice(1) ? ` ${styles.active}` : ""
              }`}
            >
              <a
                href={link.href}
                className={styles.itemLink}
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>

        <button
          ref={togglerRef}
          type="button"
          className={styles.toggler}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span />
          <span />
        </button>

        <span className={styles.dragHint} aria-hidden="true">
          Drag me
        </span>
      </nav>
    </>
  );
}
