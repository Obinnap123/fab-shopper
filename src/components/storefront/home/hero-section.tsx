"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

export function HeroSection() {
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headlineLines = headlineRef.current?.querySelectorAll("span") ?? [];
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .fromTo(
          headlineLines,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          imageRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.2, ease: "power4.inOut" },
          0.1
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-[100vh] bg-[var(--brand-green)] text-white">
      <div className="mx-auto grid min-h-[100vh] w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-[55%_45%]">
        <div className="space-y-6">
          <p
            ref={labelRef}
            className="text-[11px] uppercase tracking-[0.5em] text-[var(--brand-gold)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            New Collection 2025
          </p>
          <h1
            ref={headlineRef}
            className="text-[72px] leading-[0.95] text-[var(--brand-gold)] md:text-[96px]"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            {["Delight", "Closet", "Revolution"].map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p
            ref={subRef}
            className="max-w-[360px] text-[16px] text-white/75"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Premium fashion, curated for you. Shoes, bags, clothing and accessories from top
            designers — delivered to your door in Lagos.
          </p>
          <div ref={buttonsRef} className="flex flex-wrap gap-4">
            <button
              className="rounded-none bg-[var(--brand-gold)] px-8 py-4 text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Shop Now
            </button>
            <button
              className="rounded-none border border-[var(--brand-gold)] px-8 py-4 text-[13px] uppercase tracking-[0.12em] text-[var(--brand-gold)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View Lookbook
            </button>
          </div>
        </div>

        <div className="relative h-[420px] w-full md:h-[620px]">
          <div ref={imageRef} className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,36,25,0.65)] via-transparent to-transparent" />
            <Image
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800"
              alt="Fab Shopper hero"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--brand-gold)]">
        <div className="h-6 w-[1px] animate-bounce bg-[var(--brand-gold)]" />
        <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
      </div>
    </section>
  );
}
