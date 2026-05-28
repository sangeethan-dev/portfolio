"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button/Button";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const taglineRef = useRef(null);
  const headlineRef = useRef(null);
  const subheadRef = useRef(null);
  const buttonsRef = useRef(null);
  const scrollHintRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let rafId;
    let t = 0;
    let lastTime = 0;

    const trailCanvas = document.createElement("canvas");
    const trailCtx = trailCanvas.getContext("2d");

    const patEl = document.createElement("canvas");
    patEl.width = 2;
    patEl.height = 3;
    const patCtx = patEl.getContext("2d");
    patCtx.fillStyle = "rgba(0,0,0,0.028)";
    patCtx.fillRect(0, 0, 2, 1);
    const scanPattern = ctx.createPattern(patEl, "repeat");

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      trailCanvas.width = canvas.width;
      trailCanvas.height = canvas.height;
      trailCtx.fillStyle = "#0a0a0a";
      trailCtx.fillRect(0, 0, canvas.width, canvas.height);
    }
    resize();

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let smoothX = canvas.width / 2;
    let smoothY = canvas.height / 2;

    function onMouseMove(e) {
      const rect = section.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }

    section.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", resize);

    function draw(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;
      t += delta * 0.38;

      const W = canvas.width;
      const H = canvas.height;
      const R = Math.max(W, H);

      smoothX += (mouseX - smoothX) * 0.06;
      smoothY += (mouseY - smoothY) * 0.06;

      trailCtx.fillStyle = "rgba(10,10,10,0.15)";
      trailCtx.fillRect(0, 0, W, H);

      // Blob 1 — warm gold, drifts near center-left
      const b1x = W * (0.38 + Math.sin(t * 0.5) * 0.07);
      const b1y = H * (0.40 + Math.cos(t * 0.4) * 0.08);
      let grd = trailCtx.createRadialGradient(b1x, b1y, 0, b1x, b1y, R * 0.5);
      grd.addColorStop(0, "rgba(200,155,70,0.045)");
      grd.addColorStop(0.5, "rgba(160,110,40,0.015)");
      grd.addColorStop(1, "transparent");
      trailCtx.fillStyle = grd;
      trailCtx.fillRect(0, 0, W, H);

      // Blob 2 — silver/cream, follows mouse
      grd = trailCtx.createRadialGradient(smoothX, smoothY, 0, smoothX, smoothY, R * 0.48);
      grd.addColorStop(0, "rgba(220,210,195,0.035)");
      grd.addColorStop(0.5, "rgba(190,175,155,0.01)");
      grd.addColorStop(1, "transparent");
      trailCtx.fillStyle = grd;
      trailCtx.fillRect(0, 0, W, H);

      // Blob 3 — cool grey, drifts near center-right
      const b3x = W * (0.60 + Math.sin(t * 0.3 + 2) * 0.06);
      const b3y = H * (0.55 + Math.cos(t * 0.5 + 1) * 0.07);
      grd = trailCtx.createRadialGradient(b3x, b3y, 0, b3x, b3y, R * 0.42);
      grd.addColorStop(0, "rgba(120,110,100,0.04)");
      grd.addColorStop(0.5, "rgba(80,70,60,0.01)");
      grd.addColorStop(1, "transparent");
      trailCtx.fillStyle = grd;
      trailCtx.fillRect(0, 0, W, H);

      // Blob 4 — small warm accent, center
      const b4x = W * (0.50 + Math.cos(t * 0.6) * 0.05);
      const b4y = H * (0.48 + Math.sin(t * 0.7) * 0.06);
      grd = trailCtx.createRadialGradient(b4x, b4y, 0, b4x, b4y, R * 0.25);
      grd.addColorStop(0, "rgba(180,140,80,0.038)");
      grd.addColorStop(0.5, "rgba(140,100,40,0.01)");
      grd.addColorStop(1, "transparent");
      trailCtx.fillStyle = grd;
      trailCtx.fillRect(0, 0, W, H);

      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(trailCanvas, 0, 0);

      ctx.fillStyle = scanPattern;
      ctx.fillRect(0, 0, W, H);

      grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.75);
      grd.addColorStop(0, "transparent");
      grd.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    const tl = gsap.timeline({ delay: 0.3 });
    tl.from(
      [
        taglineRef.current,
        headlineRef.current,
        subheadRef.current,
        buttonsRef.current,
        scrollHintRef.current,
        locationRef.current,
      ],
      { opacity: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.22 }
    );

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      section.removeEventListener("mousemove", onMouseMove);
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={`container ${styles.content}`}>
        <p ref={taglineRef} className={styles.tagline}>
          Creative Frontend Developer · WordPress · Shopify
        </p>
        <h1 ref={headlineRef} className={styles.headline}>
          Your design deserves a developer who can <em>match</em> it.
        </h1>
        <p ref={subheadRef} className={styles.subheadline}>
          I build custom, animated websites that bring brands to life — crafted
          with clean code, smooth performance, and an eye for detail.
        </p>
        <div ref={buttonsRef} className={styles.buttons}>
          <Button variant="primary">View demos</Button>
          <Button variant="secondary">Work with me</Button>
        </div>
      </div>

      <div ref={scrollHintRef} className={styles.scrollHint}>
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>SCROLL</span>
      </div>

      <p ref={locationRef} className={styles.location}>
        Based in Sri Lanka
      </p>
    </section>
  );
}
