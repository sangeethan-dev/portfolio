"use client";

import { useEffect, useRef, useState } from "react";
import { MQ } from "@/lib/gsap";

/*
 * A muted, looping clip that only downloads when it gets near the screen,
 * only plays while visible (and `active`), and never plays at all for
 * visitors who ask for reduced motion: they get the still poster instead.
 */
export default function SceneVideo({ src, poster, active = true, className = "", alt = "" }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MQ.motion);
    const sync = () => setMotionOk(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    const nearIO = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          nearIO.disconnect();
        }
      },
      { rootMargin: "60% 0px" }
    );
    const visIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.05,
    });
    nearIO.observe(el);
    visIO.observe(el);
    return () => {
      nearIO.disconnect();
      visIO.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (visible && active) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [visible, active, near, motionOk]);

  return (
    <div ref={wrapRef} className={className}>
      {/* The poster is a real <img> so it paints fast and has alt text */}
      <img src={poster} alt={alt} loading="lazy" decoding="async" />
      {motionOk && near && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          disablePictureInPicture
        />
      )}
    </div>
  );
}
