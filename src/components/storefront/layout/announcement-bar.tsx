"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const tickerText =
  "FREE DELIVERY ON ORDERS ABOVE ?50,000 ? NEW ARRIVALS JUST DROPPED ? SHOP THE COLLECTION ? ";

export function AnnouncementBar() {
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 20,
        ease: "none",
        repeat: -1
      });

      const onEnter = () => tween.pause();
      const onLeave = () => tween.play();
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);
      return () => {
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden bg-forest text-gold">
      <div className="relative flex whitespace-nowrap" ref={trackRef}>
        <span className="px-6 py-2 text-xs font-semibold tracking-[0.35em]">
          {tickerText}
        </span>
        <span className="px-6 py-2 text-xs font-semibold tracking-[0.35em]">
          {tickerText}
        </span>
      </div>
    </div>
  );
}
