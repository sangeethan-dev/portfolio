"use client";

import { useRouter } from "next/navigation";
import { scrollToSection } from "./useLenis";

/*
 * One click handler for "#section" and "/page" links that works on every
 * route: a hash smooth-scrolls when that section is on the current page,
 * otherwise it navigates to the homepage section ("/#pricing").
 * Returns go(href, event?) — pass the click event to keep native
 * behaviour for ctrl/cmd-clicks.
 */
export default function useSectionNav() {
  const router = useRouter();

  return function go(href, e) {
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) return;
    if (e) e.preventDefault();

    if (href.startsWith("#")) {
      if (href === "#top" || document.querySelector(href)) {
        scrollToSection(href, 0);
        return;
      }
      router.push(`/${href}`);
      return;
    }
    router.push(href);
  };
}

/* Routes that render their own #sections (header nav, #contact, …) */
const SECTION_PAGES = ["/", "/agencies"];

/* The href to render for a section link on the current route */
export function sectionHref(href, pathname) {
  return href.startsWith("#") && !SECTION_PAGES.includes(pathname) ? `/${href}` : href;
}
