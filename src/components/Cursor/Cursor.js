"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

export default function Cursor() {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    let frameId = null;
    let targetX = -100;
    let targetY = -100;

    function onMouseMove(e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          dot.style.transform = `translate(${targetX}px, ${targetY}px)`;
          frameId = null;
        });
      }
    }

    function onMouseEnter() {
      dot.style.opacity = "1";
    }

    function onMouseLeave() {
      dot.style.opacity = "0";
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return <div ref={dotRef} className={styles.cursor} />;
}
