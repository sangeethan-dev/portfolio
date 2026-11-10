"use client";

import { useRef } from "react";
import { gsap, MQ } from "@/lib/gsap";
import styles from "./Button.module.css";

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Phone() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M4.2 1.8 6 2.3l.9 3-1.4 1.1a8.3 8.3 0 0 0 4.1 4.1l1.1-1.4 3 .9.5 1.8c-.4 1.3-1.5 2.2-2.9 2.2C6 14 2 10 2 4.7c0-1.4.9-2.5 2.2-2.9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/*
 * Riptide's one button. variant: "solid" (coral), "ghost" (outlined bone),
 * "text" (underlined). icon: "arrow" | "phone" | null.
 * Renders an <a> when href is given, otherwise a <button>.
 */
export default function Button({
  children,
  href,
  onClick,
  variant = "solid",
  icon = "arrow",
  size = "md",
  className = "",
  ...rest
}) {
  const iconRef = useRef(null);

  function nudge(on) {
    if (!iconRef.current || !window.matchMedia(MQ.motion).matches) return;
    gsap.to(iconRef.current, {
      x: on ? (icon === "phone" ? 0 : 4) : 0,
      rotate: on && icon === "phone" ? -12 : 0,
      duration: 0.35,
      ease: "power3.out",
    });
  }

  const cls = `${styles.btn} ${styles[variant]} ${styles[size]} ${className}`;
  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {icon && (
        <span ref={iconRef} className={styles.icon}>
          {icon === "phone" ? <Phone /> : <Arrow />}
        </span>
      )}
    </>
  );

  const events = {
    onPointerEnter: () => nudge(true),
    onPointerLeave: () => nudge(false),
  };

  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...events} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} {...events} {...rest}>
      {inner}
    </button>
  );
}

export { Arrow, Phone };
