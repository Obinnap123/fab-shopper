"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const headline = "Command the room with Lagos-crafted couture.";

export function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        const letters = headlineRef.current.querySelectorAll("span");
        gsap.fromTo(
          letters,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.03 }
        );
      }

      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: "power3.out" }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current.children,
          { y: 12, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.45, stagger: 0.1 }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,168,76,0.2),_transparent_45%)]" />
      <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -left-10 bottom-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[90vh] w-full max-w-6xl flex-col justify-center gap-6 px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-gold">
          Fab Shopper Lagos
        </p>
        <h1 ref={headlineRef} className="font-serif text-5xl leading-tight md:text-7xl">
          {headline.split("").map((char, index) => (
            <span key={`${char}-${index}`} className="inline-block">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p ref={subRef} className="max-w-2xl text-lg text-cream/70">
          Luxe womenswear and accessories engineered for power dressing. Discover curated
          collections, limited drops, and bespoke Lagos craftsmanship.
        </p>
        <div ref={ctaRef} className="flex flex-wrap gap-4">
          <button className="rounded-full bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-forest">
            Shop Now
          </button>
          <button className="rounded-full border border-cream/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-cream">
            New Arrivals
          </button>
        </div>
        <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-gold">
          <span className="h-[1px] w-10 bg-gold" />
          Scroll
        </div>
      </div>
    </section>
  );
}
