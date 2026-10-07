"use client";

import { useEffect, useRef } from "react";
import { gsap, MQ } from "./index";

/*
 * Magnetic pull toward the pointer with an elastic snap back.
 * An optional child marked [data-magnetic-inner] travels further (parallax).
 */
export default function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(MQ.finePointer).matches) return;
    if (window.matchMedia(MQ.reduced).matches) return;

    const inner = el.querySelector("[data-magnetic-inner]");
    const ease = { duration: 0.6, ease: "power3.out" };
    const xTo = gsap.quickTo(el, "x", ease);
    const yTo = gsap.quickTo(el, "y", ease);
    const ixTo = inner && gsap.quickTo(inner, "x", ease);
    const iyTo = inner && gsap.quickTo(inner, "y", ease);

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      if (inner) {
        ixTo(dx * strength * 0.5);
        iyTo(dy * strength * 0.5);
      }
    }

    function onLeave() {
      const back = { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: true };
      gsap.to(el, back);
      if (inner) gsap.to(inner, back);
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      const targets = [el, inner].filter(Boolean);
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: "transform" });
    };
  }, [strength]);

  return ref;
}
