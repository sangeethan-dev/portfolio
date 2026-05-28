"use client";

import React, { useRef } from "react";
import "./gravity-fall.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Matter from "matter-js";

gsap.registerPlugin(ScrollTrigger);

const page = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const lenis = new Lenis();

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      const container = containerRef.current;
      if (!container) return;

      const animateOnScroll = true;

      const config = {
        gravity: { x: 0, y: 1 },
        restitution: 0.5,
        friction: 0.15,
        frictionAir: 0.02,
        density: 0.002,
        wallThickness: 200,
        mouseStiffness: 0.6,
      };

      let engine,
        runner,
        mouseConstraint,
        bodies = [],
        topWall = null;

      function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
      }

      function initPhysics(container) {
        engine = Matter.Engine.create();
        engine.gravity = config.gravity;
        engine.constraintIterations = 10;
        engine.positionIterations = 20;
        engine.velocityIterations = 16;
        engine.timing.timeScale = 1;

        const containerRect = container.getBoundingClientRect();
        const wallThickness = config.wallThickness;

        const walls = [
          Matter.Bodies.rectangle(
            containerRect.width / 2,
            containerRect.height + wallThickness / 2,
            containerRect.width + wallThickness * 2,
            wallThickness,
            { isStatic: true }
          ),
          Matter.Bodies.rectangle(
            -wallThickness / 2,
            containerRect.height / 2,
            wallThickness,
            containerRect.height + wallThickness * 2,
            { isStatic: true }
          ),
          Matter.Bodies.rectangle(
            containerRect.width + wallThickness / 2,
            containerRect.height / 2,
            wallThickness,
            containerRect.height + wallThickness * 2,
            { isStatic: true }
          ),
        ];

        Matter.World.add(engine.world, walls);

        const objects = container.querySelectorAll(".object");

        objects.forEach((obj, index) => {
          const objRect = obj.getBoundingClientRect();

          const startX =
            Math.random() * (containerRect.width - objRect.width) +
            objRect.width / 2;
          const startY = -500 - index * 200;
          const startRotation = (Math.random() - 0.5) * Math.PI;

          const body = Matter.Bodies.rectangle(
            startX,
            startY,
            objRect.width,
            objRect.height,
            {
              restitution: config.restitution,
              friction: config.friction,
              frictionAir: config.frictionAir,
              density: config.density,
            }
          );

          Matter.Body.setAngle(body, startRotation);

          bodies.push({
            body: body,
            element: obj,
            width: objRect.width,
            height: objRect.height,
          });

          Matter.World.add(engine.world, body);
        });

        setTimeout(() => {
          topWall = Matter.Bodies.rectangle(
            containerRect.width / 2,
            -wallThickness / 2,
            containerRect.width + wallThickness * 2,
            wallThickness,
            { isStatic: true }
          );
          Matter.World.add(engine.world, topWall);
        }, 8000);

        const mouse = Matter.Mouse.create(container);

        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

        mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: config.mouseStiffness,
            render: { visible: false },
          },
        });

        mouseConstraint.mouse.element.oncontextmenu = () => false;

        let dragging = null;
        let originalInertia = null;

        Matter.Events.on(mouseConstraint, "startdrag", function (event) {
          dragging = event.body;

          if (dragging) {
            originalInertia = dragging.inertia;
            Matter.Body.setInertia(dragging, Infinity);
            Matter.Body.setVelocity(dragging, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(dragging, 0);
          }
        });

        Matter.Events.on(mouseConstraint, "enddrag", function (event) {
          if (dragging) {
            Matter.Body.setInertia(dragging, originalInertia || 1);
            dragging = null;
            originalInertia = null;
          }
        });

        Matter.Events.on(engine, "beforeUpdate", function () {
          if (dragging) {
            const found = bodies.find((b) => b.body === dragging);
            if (found) {
              const minX = found.width / 2;
              const maxX = containerRect.width - found.width / 2;
              const minY = found.height / 2;
              const maxY = containerRect.height - found.height / 2;

              Matter.Body.setPosition(dragging, {
                x: clamp(dragging.position.x, minX, maxX),
                y: clamp(dragging.position.y, minY, maxY),
              });

              Matter.Body.setVelocity(dragging, {
                x: clamp(dragging.velocity.x, -20, 20),
                y: clamp(dragging.velocity.y, -20, 20),
              });
            }
          }
        });

        container.addEventListener("mouseleave", () => {
          mouseConstraint.constraint.bodyB = null;
          mouseConstraint.constraint.pointB = null;
        });

        document.addEventListener("mouseup", () => {
          mouseConstraint.constraint.bodyB = null;
          mouseConstraint.constraint.pointB = null;
        });

        Matter.World.add(engine.world, mouseConstraint);

        runner = Matter.Runner.create();
        Matter.Runner.run(runner, engine);

        function updatePositions() {
          bodies.forEach(({ body, element, width, height }) => {
            const x = clamp(
              body.position.x - width / 2,
              0,
              containerRect.width - width
            );

            const y = clamp(
              body.position.y - height / 2,
              -height * 3,
              containerRect.height - height
            );

            element.style.left = x + "px";
            element.style.top = y + "px";
            element.style.transform = `rotate(${body.angle}rad)`;
          });

          requestAnimationFrame(updatePositions);
        }
        updatePositions();
      }

      if (animateOnScroll) {
        document.querySelectorAll("section").forEach((section) => {
          if (section.querySelector(".object-container")) {
            ScrollTrigger.create({
              trigger: section,
              start: "top bottom",
              once: true,
              onEnter: () => {
                const container = section.querySelector(".object-container");
                if (container && !engine) {
                  initPhysics(container);
                }
              },
            });
          }
        });
      } else {
        window.addEventListener("load", () => {
          const container = document.querySelector(".object-container");
          if (container) {
            initPhysics(container);
          }
        });
      }
    },
    {
      scope: containerRef,
    }
  );
  return (
    <main>
      <section className="hero">
        <h1 className="heading-xl">Welcome to the Playground of Physics</h1>
        <p>Scroll down to explore interactive tech.</p>
      </section>
      <section className="footer">
        <div className="object-container" ref={containerRef}>
          <div className="object">
            <p>HTML</p>
          </div>
          <div className="object">
            <p>CSS</p>
          </div>
          <div className="object">
            <p>JavaScript</p>
          </div>
          <div className="object">
            <p>React</p>
          </div>
          <div className="object">
            <p>Next.js</p>
          </div>
          <div className="object">
            <p>WordPress</p>
          </div>
          <div className="object">
            <p>Vue.js</p>
          </div>
          <div className="object">
            <p>Nuxt.js</p>
          </div>
          <div className="object">
            <p>Tailwind CSS</p>
          </div>
          <div className="object">
            <p>Node.js</p>
          </div>
          <div className="object">
            <p>Strapi</p>
          </div>
          <div className="object">
            <p>MySQL</p>
          </div>
          <div className="object">
            <p>TypeScript</p>
          </div>
          <div className="object">
            <p>Shopify</p>
          </div>
          <div className="object">
            <p>PHP</p>
          </div>
          <div className="object">
            <p>Vite</p>
          </div>
          <div className="object">
            <p>Framer Motion</p>
          </div>
          <div className="object">
            <p>GSAP</p>
          </div>
          <div className="object">
            <p>Netlify</p>
          </div>
          <div className="object">
            <p>Vercel</p>
          </div>
          <div className="object">
            <p>Git</p>
          </div>
          <div className="object">
            <p>GitHub</p>
          </div>
        </div>
        <div className="footer-content">
          <h2 className="heading-xl">Where Code Meets Motion</h2>
        </div>
      </section>
    </main>
  );
};

export default page;
