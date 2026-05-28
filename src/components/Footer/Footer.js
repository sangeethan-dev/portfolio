"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef  = useRef(null);
  const canvasRef  = useRef(null);
  const topRef     = useRef(null);
  const bottomRef  = useRef(null);

  /* ── Aurora canvas ────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    const footer = footerRef.current;
    const ctx    = canvas.getContext("2d");

    let raf;
    let t = 0;
    let mx = 0, my = 0, targetX = 0, targetY = 0;

    function resize() {
      canvas.width  = footer.clientWidth;
      canvas.height = footer.clientHeight;
    }

    function onMouseMove(e) {
      const rect = footer.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      const r = Math.min(W, H) * 0.55;

      ctx.clearRect(0, 0, W, H);

      mx += (targetX - mx) * 0.05;
      my += (targetY - my) * 0.05;
      t  += 0.007;

      /* Blob 1 — warm gold */
      const b1x = W * (0.25 + Math.sin(t * 0.5) * 0.08);
      const b1y = H * (0.5  + Math.cos(t * 0.4) * 0.3);
      const g1  = ctx.createRadialGradient(b1x, b1y, 0, b1x, b1y, r);
      g1.addColorStop(0,   "rgba(200,155,70,0.22)");
      g1.addColorStop(0.5, "rgba(160,110,40,0.08)");
      g1.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      /* Blob 2 — silver cream, follows mouse */
      const g2 = ctx.createRadialGradient(mx, my, 0, mx, my, r * 0.8);
      g2.addColorStop(0,   "rgba(220,210,195,0.12)");
      g2.addColorStop(0.4, "rgba(180,165,140,0.04)");
      g2.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      /* Blob 3 — deep warm */
      const b3x = W * (0.75 + Math.sin(t * 0.3 + 2) * 0.08);
      const b3y = H * (0.5  + Math.cos(t * 0.5 + 1) * 0.3);
      const g3  = ctx.createRadialGradient(b3x, b3y, 0, b3x, b3y, r * 0.7);
      g3.addColorStop(0,   "rgba(140,100,50,0.14)");
      g3.addColorStop(0.5, "rgba(80,60,30,0.05)");
      g3.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    }

    resize();
    targetX = canvas.width  * 0.5;
    targetY = canvas.height * 0.5;
    mx = targetX;
    my = targetY;
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(footer);
    footer.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      footer.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  /* ── GSAP entrance ────────────────────────────────────────────── */
  useEffect(() => {
    const els = [topRef.current, bottomRef.current];
    gsap.set(els, { opacity: 0, y: 16 });

    const st = ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top 90%",
      once: true,
      onEnter() {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Top — headline + contact */}
        <div ref={topRef} className={styles.top}>
          <h2 className={styles.head}>
            Let&apos;s build something <em className={styles.em}>great.</em>
          </h2>

          <div className={styles.contact}>
            <a href="mailto:email2geethan@gmail.com" className={styles.val}>
              email2geethan@gmail.com
            </a>
            <span className={styles.sep} />
            <a href="tel:+94770000000" className={styles.val}>
              +94 77 000 0000
            </a>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Bottom bar */}
        <div ref={bottomRef} className={styles.bar}>
          <div className={styles.avail}>
            <span className={styles.dot} />
            Open for projects
          </div>
          <span className={styles.copy}>© 2026 Sangeethan</span>
          <span className={styles.built}>Built with Next.js + GSAP</span>
        </div>
      </div>
    </footer>
  );
}
