"use client";

import { useEffect, useRef } from "react";
import { MQ } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import useMagnetic from "@/lib/gsap/useMagnetic";
import { skills, contact } from "@/content/site";
import styles from "./Playground.module.css";

/*
 * Skill tags fall into a physics pit (matter-js, loaded on demand) and can be
 * grabbed and thrown with a mouse. On touch screens the pit doesn't capture
 * drags (so the page still scrolls) — the Shake button does the fun part.
 */
export default function Playground() {
  const pitRef = useRef(null);
  const shakeRef = useRef(null);
  const titleRef = useSplitReveal({ type: "chars", stagger: 0.025 });
  const linkRef = useMagnetic(0.3);

  useEffect(() => {
    const pit = pitRef.current;
    const tags = Array.from(pit.querySelectorAll("[data-tag]"));
    const reduced = window.matchMedia(MQ.reduced).matches;
    const fine = window.matchMedia(MQ.finePointer).matches;

    if (reduced) {
      pit.dataset.static = "true";
      return;
    }

    let Matter;
    let engine;
    let runner;
    let raf = 0;
    let bodies = [];
    let walls = [];
    let started = false;
    let disposed = false;
    let visible = false;

    function buildWalls(W, H) {
      const t = 400;
      const { Bodies, Composite } = Matter;
      if (walls.length) Composite.remove(engine.world, walls);
      walls = [
        Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2, t, H * 4, { isStatic: true }),
      ];
      Composite.add(engine.world, walls);
    }

    function render() {
      raf = 0;
      bodies.forEach(({ body, el, w, h }) => {
        el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`;
      });
      if (visible) raf = requestAnimationFrame(render);
    }

    async function start() {
      if (started) return;
      started = true;
      Matter = (await import("matter-js")).default;
      if (disposed) return;

      const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;
      const W = pit.clientWidth;
      const H = pit.clientHeight;

      engine = Engine.create({ gravity: { x: 0, y: 1 } });
      buildWalls(W, H);

      bodies = tags.map((el, i) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const body = Bodies.rectangle(
          w / 2 + Math.random() * (W - w),
          -100 - i * 70,
          w,
          h,
          { chamfer: { radius: h / 2 }, restitution: 0.45, friction: 0.2, frictionAir: 0.015, density: 0.002 }
        );
        Body.setAngle(body, (Math.random() - 0.5) * 0.8);
        el.style.visibility = "visible";
        return { body, el, w, h };
      });
      Composite.add(engine.world, bodies.map((b) => b.body));

      if (fine) {
        const mouse = Mouse.create(pit);
        // let the page scroll with the wheel over the pit
        mouse.element.removeEventListener("wheel", mouse.mousewheel);
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
        const mc = MouseConstraint.create(engine, {
          mouse,
          constraint: { stiffness: 0.2, render: { visible: false } },
        });
        Composite.add(engine.world, mc);
        Events.on(mc, "startdrag", () => (pit.dataset.dragging = "true"));
        Events.on(mc, "enddrag", () => (pit.dataset.dragging = "false"));
      }

      runner = Runner.create();
      Runner.run(runner, engine);
      raf = requestAnimationFrame(render);
    }

    function shake() {
      if (!engine) return;
      const { Body } = Matter;
      bodies.forEach(({ body }) => {
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 18, y: -10 - Math.random() * 14 });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.4);
      });
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          start();
          if (runner) {
            runner.enabled = true;
            if (!raf) raf = requestAnimationFrame(render);
          }
        } else if (runner) {
          runner.enabled = false;
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(pit);

    function onResize() {
      if (!engine) return;
      buildWalls(pit.clientWidth, pit.clientHeight);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(pit);

    const btn = shakeRef.current;
    btn.addEventListener("click", shake);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      btn.removeEventListener("click", shake);
      cancelAnimationFrame(raf);
      if (runner) Matter.Runner.stop(runner);
      if (engine) {
        Matter.Composite.clear(engine.world, false);
        Matter.Engine.clear(engine);
      }
    };
  }, []);

  return (
    <section id="playground" className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 04 — Playground</span>
        <h2 ref={titleRef} className={styles.title}>
          Off the clock
        </h2>
        <div className={styles.side}>
          <p className={styles.intro}>
            When I&apos;m not working on client sites, I play around with physics, motion and small
            interactions. It keeps me sharp, and the good ideas usually end up in real projects. Grab a tag and
            throw it.
          </p>
          <a
            ref={linkRef}
            href={contact.inspirations}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            data-cursor="Open"
          >
            <span data-magnetic-inner>Explore my experiment library ↗</span>
          </a>
        </div>
      </div>

      <div className="container">
        <div ref={pitRef} className={styles.pit} data-cursor="Drag">
          <span className={styles.pitLabel}>
            gravity: 1 · bodies: {skills.length} · <b>matter.js</b>
          </span>
          <button ref={shakeRef} type="button" className={styles.shake}>
            Shake ↯
          </button>
          {skills.map((s, i) => (
            <span key={s} className={`${styles.tag} ${styles[`t${i % 4}`]}`} data-tag>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
