"use client";

import styles from "./Pricing.module.css";

const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/*
 * Each digit is a vertical strip of 0–9 (twice, for a longer roll).
 * The parent animates [data-strip] to its data-digit — see Pricing.js.
 * Screen readers get the plain value.
 */
export default function Odometer({ value }) {
  const text = value.toLocaleString("en-AU");
  return (
    <span className={styles.odo}>
      <span className="sr-only">{text}</span>
      <span className={styles.odoVisual} aria-hidden="true">
        {text.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className={styles.digit}>
              {/* invisible sizer: the slot is exactly as wide as its final digit */}
              <span className={styles.sizer}>{ch}</span>
              <span className={styles.strip} data-strip data-digit={ch}>
                {STRIP.map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className={styles.sep}>
              {ch}
            </span>
          )
        )}
      </span>
    </span>
  );
}
