"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Stack.module.css";

gsap.registerPlugin(ScrollTrigger);

const stack = [
  { cat: "Foundation",  name: "HTML"       },
  { cat: "Foundation",  name: "CSS"        },
  { cat: "Foundation",  name: "JavaScript" },
  { cat: "Foundation",  name: "PHP"        },
  { cat: "CMS",         name: "WordPress"  },
  { cat: "E-Commerce",  name: "Shopify"    },
  { cat: "Templating",  name: "Liquid"     },
  { cat: "Library",     name: "React"      },
  { cat: "Framework",   name: "Next.js"    },
  { cat: "Animation",   name: "GSAP"       },
  { cat: "Animation",   name: "Framer"     },
  { cat: "Styling",     name: "Tailwind"   },
];

const headlineWords = [
  { text: "Tools" },
  { text: "I" },
  { text: "build" },
  { text: "with.", em: true },
];

export default function Stack() {
  const sectionRef  = useRef(null);
  const labelRef    = useRef(null);
  const wordRefs    = useRef([]);
  const captionRef  = useRef(null);
  const wrapperRef  = useRef(null);
  const canvasRef   = useRef(null);
  const cellRefs    = useRef([]);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const wrapper = wrapperRef.current;
    const ctx     = canvas.getContext("2d");

    let rafId;
    let mx = 0, my = 0, cmx = 0, cmy = 0;
    let inside  = false;
    let opacity = 0;

    function resize() {
      canvas.width  = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
    }
    resize();

    function onMouseMove(e) {
      const rect = wrapper.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      inside = true;
    }
    function onMouseLeave() { inside = false; }

    wrapper.addEventListener("mousemove",  onMouseMove);
    wrapper.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize",     resize);

    function loop() {
      cmx += (mx - cmx) * 0.1;
      cmy += (my - cmy) * 0.1;

      if (inside)  opacity = Math.min(opacity + 0.06, 1);
      else         opacity = Math.max(opacity - 0.04, 0);

      if (opacity > 0) {
        const W = canvas.width;
        const H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        const grd = ctx.createRadialGradient(cmx, cmy, 0, cmx, cmy, 180);
        grd.addColorStop(0,    `rgba(232,220,196,${(0.28  * opacity).toFixed(3)})`);
        grd.addColorStop(0.35, `rgba(232,220,196,${(0.12  * opacity).toFixed(3)})`);
        grd.addColorStop(0.7,  `rgba(200,180,150,${(0.04  * opacity).toFixed(3)})`);
        grd.addColorStop(1,    "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    const words = wordRefs.current.filter(Boolean);
    const cells = cellRefs.current.filter(Boolean);

    gsap.set(labelRef.current, { opacity: 0, y: 24 });
    gsap.set(words,            { opacity: 0.15 });
    gsap.set(cells,            { opacity: 0, y: 20 });
    gsap.set(captionRef.current, { opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
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
        gsap.to(cells, {
          opacity:  1,
          y:        0,
          duration: 0.6,
          ease:     "power3.out",
          stagger:  0.04,
          delay:    0.6,
        });
        gsap.to(captionRef.current, {
          opacity:  1,
          duration: 0.6,
          delay:    cells.length * 0.04 + 0.9,
        });
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      wrapper.removeEventListener("mousemove",  onMouseMove);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize",      resize);
      st.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="stack" className={styles.section}>

      <div className={`container ${styles.header}`}>
        <p ref={labelRef} className={styles.label}>The Stack</p>
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
      </div>

      <div className="container">
        <div ref={wrapperRef} className={styles.gridWrapper}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.grid}>
            {stack.map((item, i) => (
              <div
                key={item.name}
                ref={(el) => (cellRefs.current[i] = el)}
                className={styles.cell}
              >
                <div className={styles.shimmer} />
                <p className={styles.cellCat}>{item.cat}</p>
                <p className={styles.cellName}>{item.name}</p>
                <div className={styles.cellDot} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={captionRef} className={`container ${styles.captionRow}`}>
        <span className={styles.captionItem}>8 Years</span>
        <span className={styles.captionSep} />
        <span className={styles.captionItem}>30+ Websites</span>
        <span className={styles.captionSep} />
        <span className={styles.captionItem}>Built to perform</span>
      </div>

    </section>
  );
}
