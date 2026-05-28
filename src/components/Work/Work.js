"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Work.module.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    num: "01",
    title: "Roast & Co",
    cat: "Restaurant",
    theme: "Cinematic Editorial",
    colors: ["#3d1f08", "#1a0800"],
  },
  {
    num: "02",
    title: "Estare",
    cat: "Real Estate",
    theme: "Modern Bento Minimal",
    colors: ["#08182d", "#030d1a"],
  },
  {
    num: "03",
    title: "Pulse",
    cat: "Fitness",
    theme: "Bold Kinetic",
    colors: ["#2d0808", "#120202"],
  },
  {
    num: "04",
    title: "Forma",
    cat: "Creative",
    theme: "Editorial Brutalist",
    colors: ["#0a0a1e", "#050510"],
  },
  {
    num: "05",
    title: "Kova",
    cat: "Fashion",
    theme: "Luxury Minimal",
    colors: ["#1a1a12", "#0a0a07"],
  },
];

const headlineWords = [
  { text: "Crafted" },
  { text: "to" },
  { text: "show" },
  { text: "what's", em: true },
  { text: "possible.", em: true },
];

function drawPreview(canvas, project) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, project.colors[0]);
  bg.addColorStop(1, project.colors[1]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  let rg = ctx.createRadialGradient(W * 0.7, H * 0.3, 0, W * 0.7, H * 0.3, 80);
  rg.addColorStop(0, "rgba(255,255,255,0.04)");
  rg.addColorStop(1, "transparent");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);

  rg = ctx.createRadialGradient(W * 0.2, H * 0.7, 0, W * 0.2, H * 0.7, 55);
  rg.addColorStop(0, "rgba(255,255,255,0.03)");
  rg.addColorStop(1, "transparent");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let y = 0; y < H; y += 14) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = "500 15px Inter, sans-serif";
  ctx.fillText(project.title, 16, H - 30);

  ctx.fillStyle = "rgba(255,255,255,0.30)";
  ctx.font = "9px Inter, sans-serif";
  ctx.fillText(project.theme.toUpperCase(), 16, H - 14);
}

export default function Work() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const wordRefs    = useRef([]);
  const subRef      = useRef(null);
  const footerRef   = useRef(null);
  const previewRef  = useRef(null);
  const canvasRef   = useRef(null);
  const rowRefs     = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const preview = previewRef.current;
    const canvas  = canvasRef.current;

    let rafId;
    let targetX = 0, targetY = 0;
    let smoothX = 0, smoothY = 0;

    function onMouseMove(e) {
      const rect = section.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    }

    function loop() {
      smoothX += (targetX - smoothX) * 0.1;
      smoothY += (targetY - smoothY) * 0.1;
      preview.style.left = smoothX + "px";
      preview.style.top  = smoothY + "px";
      rafId = requestAnimationFrame(loop);
    }

    section.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(loop);

    const rows = rowRefs.current.filter(Boolean);
    const handlers = rows.map((row, i) => {
      const enter = () => {
        drawPreview(canvas, projects[i]);
        preview.classList.add(styles.previewVisible);
      };
      const leave = () => {
        preview.classList.remove(styles.previewVisible);
      };
      row.addEventListener("mouseenter", enter);
      row.addEventListener("mouseleave", leave);
      return { row, enter, leave };
    });

    const words = wordRefs.current.filter(Boolean);

    gsap.set(labelRef.current, { opacity: 0, y: 24 });
    gsap.set(words,            { opacity: 0.15 });
    gsap.set(subRef.current,   { opacity: 0, y: 24 });
    gsap.set(rows,             { opacity: 0, y: 20 });
    gsap.set(footerRef.current, { opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: section,
      start:   "top 80%",
      once:    true,
      onEnter() {
        gsap.to(labelRef.current, {
          opacity:  1,
          y:        0,
          duration: 0.8,
          ease:     "power3.out",
        });
        gsap.to(words, {
          opacity:  1,
          duration: 0.6,
          ease:     "power2.out",
          stagger:  0.1,
          delay:    0.2,
        });
        gsap.to(subRef.current, {
          opacity:  1,
          y:        0,
          duration: 0.8,
          ease:     "power3.out",
          delay:    0.7,
        });
        gsap.to(rows, {
          opacity:  1,
          y:        0,
          duration: 0.7,
          ease:     "power3.out",
          stagger:  0.1,
          delay:    0.4,
        });
        gsap.to(footerRef.current, {
          opacity:  1,
          duration: 0.6,
          delay:    rows.length * 0.1 + 0.7,
        });
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      section.removeEventListener("mousemove", onMouseMove);
      handlers.forEach(({ row, enter, leave }) => {
        row.removeEventListener("mouseenter", enter);
        row.removeEventListener("mouseleave", leave);
      });
      st.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className={styles.section}>
      <div ref={previewRef} className={styles.preview}>
        <canvas ref={canvasRef} width={260} height={170} />
      </div>

      <div className="container">
        <div className={styles.header}>
          <p ref={labelRef} className={styles.label}>Selected Work</p>
          <h2 className={styles.headline}>
            {headlineWords.map((w, i) => (
              <span
                key={i}
                ref={(el) => (wordRefs.current[i] = el)}
                className={w.em ? `${styles.word} ${styles.wordEm}` : styles.word}
              >
                {w.text}
              </span>
            ))}
          </h2>
          <p ref={subRef} className={styles.sub}>
            Five directions. Five stories. Each built to show a different side
            of what I can do.
          </p>
        </div>

        <div className={styles.rows}>
          {projects.map((project, i) => (
            <div
              key={project.num}
              ref={(el) => (rowRefs.current[i] = el)}
              className={`${styles.row}${i === projects.length - 1 ? ` ${styles.rowLast}` : ""}`}
            >
              <span className={styles.rowNum}>{project.num}</span>

              <div className={styles.rowMid}>
                <span className={styles.rowTitle}>{project.title}</span>
                <div className={styles.rowTags}>
                  <span className={styles.rowTag}>{project.cat}</span>
                  <span className={styles.rowTag}>{project.theme}</span>
                </div>
              </div>

              <div className={styles.rowCta}>
                <span className={styles.rowIndex}>{project.num} / 05</span>
                <div className={styles.circleBtn}>
                  <svg viewBox="0 0 14 14" fill="none" width={14} height={14}>
                    <path
                      d="M3 11L11 3M11 3H5M11 3V9"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className={styles.rowLine} />
            </div>
          ))}
        </div>

        <div ref={footerRef} className={styles.footer}>
          <span className={styles.footerLeft}>Each project built from scratch</span>
          <span className={styles.footerRight}>No templates. No shortcuts.</span>
        </div>
      </div>
    </section>
  );
}
