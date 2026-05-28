"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Lab.module.css";

gsap.registerPlugin(ScrollTrigger);

const previewCards = [
  {
    cat: "Cards",
    title: "Magnetic Cards",
    tags: ["GSAP", "Physics"],
    gradient: "linear-gradient(135deg, #141414, #1a1510)",
  },
  {
    cat: "Hero",
    title: "Scroll Reveal",
    tags: ["Framer", "Scroll"],
    gradient: "linear-gradient(135deg, #141414, #10141a)",
  },
  {
    cat: "Text Anim",
    title: "Kinetic Type",
    tags: ["GSAP", "Clip"],
    gradient: "linear-gradient(135deg, #141414, #141a14)",
  },
  {
    cat: "Marquee",
    title: "Infinite Scroll",
    tags: ["CSS", "Hover"],
    gradient: "linear-gradient(135deg, #141414, #1a1014)",
  },
  {
    cat: "Navigation",
    title: "Pill Nav",
    tags: ["Framer"],
    gradient: "linear-gradient(135deg, #141414, #141414)",
  },
  {
    cat: "Experimental",
    title: "Cursor Trail",
    tags: ["Canvas", "RAF"],
    gradient: "linear-gradient(135deg, #141414, #161416)",
  },
];

const sidebarItems = [
  { label: "All showcases", count: 24, active: true },
  { label: "Favorites", count: 6 },
  { divider: true },
  { label: "Hero", count: 4 },
  { label: "Cards", count: 3 },
  { label: "Marquee", count: 2 },
  { label: "Scroll", count: 5 },
  { label: "Text Anim", count: 3 },
  { label: "Navigation", count: 2 },
  { label: "Forms", count: 2 },
  { label: "Experimental", count: 3 },
];

const techTags = [
  "Next.js 14",
  "Framer Motion",
  "GSAP",
  "TypeScript",
  "⌘K Search",
];

export default function Lab() {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    const headline = headlineRef.current;
    const card = cardRef.current;

    gsap.set([label, headline], { opacity: 0, y: 24 });
    gsap.set(card, { opacity: 0, y: 32 });

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      once: true,
      onEnter() {
        gsap.to([label, headline], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
        });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.3,
        });
      },
    });

    return () => st.kill();
  }, []);

  return (
    <section ref={sectionRef} id="lab" className={styles.section}>
      <div className="container">
        <p ref={labelRef} className={styles.label}>
          Beyond the portfolio
        </p>
        <h2 ref={headlineRef} className={styles.headline}>
          A personal <em>creative OS.</em>
        </h2>

        <div ref={cardRef} className={styles.card}>
          {/* Left Panel */}
          <div className={styles.left}>
            <div className={styles.leftTop}>
              <div className={styles.badge}>
                <span className={styles.dot} />
                Live
              </div>

              <p className={styles.appName}>
                Sangee<span className={styles.appNameDot}>.</span> Inspirations
              </p>

              <h3 className={styles.tagline}>
                A cinematic library of <em>frontend experiments.</em>
              </h3>

              <p className={styles.description}>
                Browse, preview, and revisit frontend experiments and motion
                concepts — each showcase fully isolated, built to be explored.
              </p>

              <div className={styles.tags}>
                {techTags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="https://sangee-inspirations.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              <span className={styles.ctaText}>Explore</span>
              <div className={styles.circleBtn}>
                <svg
                  className={styles.circleBtnIcon}
                  viewBox="0 0 14 14"
                  fill="none"
                  width={14}
                  height={14}
                >
                  <path
                    d="M3 11L11 3M11 3H5M11 3V9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </a>
          </div>

          {/* Right Panel */}
          <div className={styles.right}>
            <div className={styles.topbar}>
              <span className={styles.topbarLogo}>
                Sangee<span className={styles.topbarLogoDot}>.</span>
              </span>
              <div className={styles.searchBar}>
                <span className={styles.searchText}>Search showcases...</span>
                <span className={styles.kbdBadge}>⌘K</span>
              </div>
            </div>

            <div className={styles.appBody}>
              <div className={styles.sidebar}>
                {sidebarItems.map((item, i) => {
                  if (item.divider) {
                    return (
                      <div key={i} className={styles.sidebarSection}>
                        Categories
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      className={`${styles.sidebarItem}${item.active ? ` ${styles.active}` : ""}`}
                    >
                      <span>{item.label}</span>
                      <span className={styles.sidebarCount}>{item.count}</span>
                    </div>
                  );
                })}
              </div>

              <div className={styles.gridArea}>
                <div className={styles.gridTop}>
                  <span className={styles.gridLabel}>Featured</span>
                  <span className={styles.gridCount}>24 showcases</span>
                </div>
                <div className={styles.grid}>
                  {previewCards.map((item, i) => (
                    <div key={i} className={styles.previewCard}>
                      <div
                        className={styles.previewThumb}
                        style={{ background: item.gradient }}
                      />
                      <div className={styles.previewInfo}>
                        <p className={styles.previewCat}>{item.cat}</p>
                        <p className={styles.previewTitle}>{item.title}</p>
                        <div className={styles.previewTags}>
                          {item.tags.map((tag) => (
                            <span key={tag} className={styles.previewTag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
