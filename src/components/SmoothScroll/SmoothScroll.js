"use client";

import useLenis from "@/lib/lenis/useLenis";

export default function SmoothScroll({ children }) {
  useLenis();
  return <>{children}</>;
}
