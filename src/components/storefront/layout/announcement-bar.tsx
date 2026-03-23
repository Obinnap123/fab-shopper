"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration: 30,
      ease: "none",
      repeat: -1
    });

    const onEnter = () => tween.pause();
    const onLeave = () => tween.resume();
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    return () => {
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      tween.kill();
    };
  }, []);

  const content =
    "FREE DELIVERY WITHIN LAGOS ON ORDERS ABOVE ₦300,000  ·  NEW ARRIVALS JUST DROPPED  ·  SHOP A23 JUSTICE MALL, LEKKI  ·  CALL TO ORDER: 09052613150  ·  DESIGNER SHOES · BAGS · PERFUMES · CLOTHING  ·  ";

  return (
    <div
      className="sticky top-0 z-50 w-full overflow-hidden"
      style={{ height: 40, background: "var(--brand-gold)" }}
    >
      <div
        ref={trackRef}
        className="flex h-full w-max items-center whitespace-nowrap"
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className="inline-block px-8"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--brand-green)",
              fontWeight: 500
            }}
          >
            {content}
          </span>
        ))}
      </div>
    </div>
  );
}
