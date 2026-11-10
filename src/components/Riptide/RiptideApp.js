"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis/useLenis";
import { clinic } from "@/content/riptide";
import { BookingContext } from "./Booking/BookingContext";
import BookingDrawer from "./Booking/BookingDrawer";
import Nav from "./Nav/Nav";
import Button, { Phone } from "./ui/Button";
import base from "./Riptide.module.css";
import styles from "./RiptideApp.module.css";

/* Soft, moving film grain on a compositor-only layer */
function Grain() {
  const ref = useRef(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const jitter = () =>
        gsap.set(ref.current, {
          x: gsap.utils.random(-120, 0, 1),
          y: gsap.utils.random(-120, 0, 1),
        });
      // ~11 fps, like real grain
      const tick = gsap.to({}, { duration: 0.09, repeat: -1, onRepeat: jitter });
      return () => tick.kill();
    });
    return () => mm.revert();
  });
  return <div ref={ref} className={styles.grain} aria-hidden="true" />;
}

/* Always-there booking: a bottom bar on phones, a pill on desktop */
function StickyBook({ onBook }) {
  const ref = useRef(null);
  useGSAP(() => {
    const el = ref.current;
    const reduced = window.matchMedia(MQ.reduced).matches;
    gsap.set(el, { yPercent: 140, autoAlpha: 0 });
    const show = (on) =>
      gsap.to(el, {
        yPercent: on ? 0 : 140,
        autoAlpha: on ? 1 : 0,
        duration: reduced ? 0 : 0.6,
        ease: on ? "expo.out" : "power3.in",
        overwrite: true,
      });
    const st = ScrollTrigger.create({
      trigger: "#top",
      start: "bottom 70%",
      endTrigger: "#credits",
      end: "top 55%",
      onToggle: (self) => show(self.isActive),
    });
    return () => st.kill();
  });

  return (
    <div ref={ref} className={styles.sticky}>
      <a href={clinic.phoneHref} className={styles.stickyCall}>
        <Phone />
        <span>Call</span>
      </a>
      <Button onClick={onBook} className={styles.stickyBook}>
        Book now
      </Button>
    </div>
  );
}

export default function RiptideApp({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState(null);

  const open = useCallback((p = {}) => {
    setPreset(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const ctx = useMemo(() => ({ open, isOpen }), [open, isOpen]);

  // Reduced motion: plain native scrolling on this site, restored on leave
  // (deferred a frame: the layout's Lenis is created after this child effect)
  useEffect(() => {
    if (!window.matchMedia(MQ.reduced).matches) return;
    let lenis = null;
    let prev = null;
    const raf = requestAnimationFrame(() => {
      lenis = getLenis();
      if (!lenis) return;
      prev = { smoothWheel: lenis.options.smoothWheel, syncTouch: lenis.options.syncTouch };
      lenis.options.smoothWheel = false;
      lenis.options.syncTouch = false;
    });
    return () => {
      cancelAnimationFrame(raf);
      if (lenis && prev) Object.assign(lenis.options, prev);
    };
  }, []);

  // Pins and webfonts shift layout after first paint
  useEffect(() => {
    let cancelled = false;
    const ready = document.fonts ? document.fonts.ready : Promise.resolve();
    ready.then(() => !cancelled && ScrollTrigger.refresh());
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <BookingContext.Provider value={ctx}>
      <a href="#main" className={base.skip}>
        Skip to content
      </a>
      <Nav />
      <main id="main">{children}</main>
      <StickyBook onBook={() => open({})} />
      <BookingDrawer open={isOpen} preset={preset} onClose={close} />
      <Grain />
    </BookingContext.Provider>
  );
}
