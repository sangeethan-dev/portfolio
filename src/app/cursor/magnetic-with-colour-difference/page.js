"use client";

import React, { useEffect } from "react";
import "./style.css";

const page = () => {
  useEffect(() => {
    const link = document.querySelectorAll("nav > .hover-this");
    const cursor = document.querySelector(".cursor");

    let xSet = 0,
      ySet = 0;

    const animateit = function (e) {
      const span = this.querySelector("span");
      const { offsetX: x, offsetY: y } = e;
      const { offsetWidth: width, offsetHeight: height } = this;
      const move = 30;

      const xMove = (x / width) * (move * 2) - move;
      const yMove = (y / height) * (move * 2) - move;

      // lerp between old and new positions
      xSet += (xMove - xSet) * 0.2;
      ySet += (yMove - ySet) * 0.2;

      span.style.transform = `translate(${xSet}px, ${ySet}px)`;

      if (e.type === "mouseleave") {
        xSet = 0;
        ySet = 0;
        span.style.transform = "";
      }
    };

    const editCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      cursor.style.left = x + "px";
      cursor.style.top = y + "px";
    };

    link.forEach((b) => b.addEventListener("mousemove", animateit));
    link.forEach((b) => b.addEventListener("mouseleave", animateit));
    window.addEventListener("mousemove", editCursor);
  }, []);

  return (
    <main>
      <div className="nav-wrapper">
        <nav>
          <a href="#" className="hover-this">
            <span>Home</span>
          </a>
          <a href="#" className="hover-this">
            <span>About Us</span>
          </a>
          <a href="#" className="hover-this">
            <span>Products</span>
          </a>
          <a href="#" className="hover-this">
            <span>Contact</span>
          </a>
          <div className="cursor"></div>
        </nav>
      </div>
    </main>
  );
};

export default page;
