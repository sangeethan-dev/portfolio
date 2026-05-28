"use client";

import React, { useEffect, useRef } from "react";
import "./style.css";

const Page = () => {
  const imgRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const handleMove = (x, y) => {
      imgRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.style.top = `${y - 225}px`;
          ref.current.style.left = `${x - 200}px`;
        }
      });
    };

    const resetToCenter = () => {
      const section = sectionRef.current;
      if (!section) return;

      const centerX = section.offsetWidth / 2;
      const centerY = section.offsetHeight / 2;

      imgRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.style.top = `${centerY - 225}px`;
          ref.current.style.left = `${centerX - 200}px`;
        }
      });
    };

    const mouseHandler = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          handleMove(e.clientX - rect.left, e.clientY - rect.top);
        } else {
          resetToCenter();
        }
      }
    };

    const touchHandler = (e) => {
      if (e.touches.length > 0 && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
        } else {
          resetToCenter();
        }
      }
    };

    const mouseEnterHandler = (e) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        handleMove(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    const touchStartHandler = (e) => {
      if (e.touches.length > 0 && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        handleMove(touch.clientX - rect.left, touch.clientY - rect.top);
      }
    };

    document.addEventListener("mousemove", mouseHandler);
    document.addEventListener("touchmove", touchHandler);
    sectionRef.current?.addEventListener("mouseenter", mouseEnterHandler);
    sectionRef.current?.addEventListener("touchstart", touchStartHandler);

    // Set initial center
    resetToCenter();

    return () => {
      document.removeEventListener("mousemove", mouseHandler);
      document.removeEventListener("touchmove", touchHandler);
      sectionRef.current?.removeEventListener("mouseenter", mouseEnterHandler);
      sectionRef.current?.removeEventListener("touchstart", touchStartHandler);
    };
  }, [imgRefs]);

  return (
    <main>
      {/* <section className="first-section"></section> */}
      <section ref={sectionRef} className="image-section">
        <div ref={imgRefs[0]} className="img img-1"></div>
        <div ref={imgRefs[1]} className="img img-2"></div>
        <div ref={imgRefs[2]} className="img img-3"></div>
        <div ref={imgRefs[3]} className="img img-4"></div>
        <div ref={imgRefs[4]} className="img img-5"></div>

        <div className="container">
          <h1>SPORTS</h1>
        </div>
      </section>
      <section className="last-section"></section>
    </main>
  );
};

export default Page;
