"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./style.css";

const Page = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    let posX = 0,
      posY = 0;
    let mouseX = window.innerWidth / 2; // start at center
    let mouseY = window.innerHeight / 2;

    // Set initial position so they don’t flicker
    gsap.set(cursorRef.current, { left: mouseX, top: mouseY });
    gsap.set(followerRef.current, { left: mouseX - 20, top: mouseY - 20 });

    const tick = () => {
      posX += (mouseX - posX) / 9;
      posY += (mouseY - posY) / 9;

      gsap.set(followerRef.current, { left: posX - 20, top: posY - 20 });
      gsap.set(cursorRef.current, { left: mouseX, top: mouseY });
    };
    gsap.ticker.add(tick);

    const moveHandler = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener("mousemove", moveHandler, { passive: true });

    return () => {
      document.removeEventListener("mousemove", moveHandler);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <main>
      <div className="cursor" ref={cursorRef}>
        <span class="cursor-text">View</span>
      </div>
      <div className="cursor-follower" ref={followerRef}></div>

      <div id="wrapper">
        <div className="portfolio-item">
          <div className="portfolio-thumb">
            <img
              ref={imgRef}
              src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Portfolio"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
