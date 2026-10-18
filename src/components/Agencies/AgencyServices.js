"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import useSplitReveal from "@/lib/gsap/useSplitReveal";
import { agency } from "@/content/site";
import styles from "./Agencies.module.css";

export default function AgencyServices() {
  const rootRef = useRef(null);
  const titleRef = useSplitReveal({ type: "lines" });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(gsap.utils.toArray("[data-service]", rootRef.current), {
          y: 60,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: rootRef.current.querySelector("[data-services]"), start: "top 82%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section id="services" ref={rootRef} className={styles.section} data-theme-section="live">
      <div className={`container ${styles.head}`}>
        <span className="label">Fig. 03 — Services</span>
        <h2 ref={titleRef} className={styles.title}>
          What I build for your clients.
        </h2>
        <p className={styles.intro}>
          The work agencies send me most. If it&apos;s a website and it&apos;s on your client list, I can probably take
          it off your hands.
        </p>
      </div>

      <ul className={`container ${styles.services}`} data-services>
        {agency.services.map((s, i) => (
          <li key={s.title} className={styles.service} data-service>
            <span className={styles.serviceNum}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.serviceTitle}>{s.title}</h3>
            <p className={styles.serviceDesc}>{s.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
