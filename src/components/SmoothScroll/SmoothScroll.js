"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";
import useLenis, { getLenis } from "@/lib/lenis/useLenis";

export default function SmoothScroll({ children }) {
  useLenis();
  const pathname = usePathname();

  // Lenis lives in the layout, so it survives page changes — start each
  // new page at the top unless the link points at a section ("/#pricing").
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    lenis.resize();

    const hash = window.location.hash;
    if (!hash) {
      lenis.scrollTo(0, { immediate: true, force: true });
      return;
    }

    // Pins and webfonts move sections after the first paint, so jump once
    // now and again after fonts load and ScrollTrigger has re-measured.
    let cancelled = false;
    function jump() {
      const el = document.querySelector(hash);
      if (!cancelled && el) lenis.scrollTo(el, { offset: 0, immediate: true, force: true });
    }
    const raf = requestAnimationFrame(jump);
    const ready = document.fonts ? document.fonts.ready : Promise.resolve();
    ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      jump();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return <>{children}</>;
}
