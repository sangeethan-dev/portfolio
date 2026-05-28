"use client";

import { useEffect, useRef } from "react";

export default function useMagnetic() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ax = 0, ay = 0;
    let rafId = null;
    let hovering = false;

    function loop() {
      ax *= 0.78;
      ay *= 0.78;
      el.style.transform = `translate(${ax}px, ${ay}px) scale(1.02)`;
      if (hovering) rafId = requestAnimationFrame(loop);
    }

    function onMouseEnter() {
      hovering = true;
      cancelAnimationFrame(rafId);
      loop();
    }

    function onMouseMove(e) {
      const rect = el.getBoundingClientRect();
      ax = (e.clientX - (rect.left + rect.width / 2)) * 0.28;
      ay = (e.clientY - (rect.top + rect.height / 2)) * 0.28;
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }

    function onMouseLeave() {
      hovering = false;
      cancelAnimationFrame(rafId);

      let vx = ax * 0.3;
      let vy = ay * 0.3;

      function springBack() {
        ax += -ax * 0.2 + vx;
        ay += -ay * 0.2 + vy;
        vx *= 0.75;
        vy *= 0.75;
        el.style.transform = `translate(${ax}px, ${ay}px) scale(1.02)`;
        if (Math.abs(ax) > 0.05 || Math.abs(ay) > 0.05) {
          rafId = requestAnimationFrame(springBack);
        } else {
          el.style.transform = "";
        }
      }

      rafId = requestAnimationFrame(springBack);
    }

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafId);
      el.style.transform = "";
    };
  }, []);

  return ref;
}
