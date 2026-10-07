"use client";

/*
 * Lets any CTA (Pricing, Work…) preselect a service in the contact form.
 * selectService() scrolls to #contact and broadcasts the choice.
 */
import { scrollToSection } from "@/lib/lenis/useLenis";

const EVENT = "enquiry:select-service";

export function selectService(value) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
  scrollToSection("#contact", 0);
}

export function onSelectService(fn) {
  const handler = (e) => fn(e.detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
