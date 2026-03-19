"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function BrandStory() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const image = section.querySelector(".story-image");
    const text = section.querySelector(".story-text");

    gsap.fromTo(
      image,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 75%" }
      }
    );

    gsap.fromTo(
      text,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 75%" }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-[var(--brand-cream)] py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-20 px-6 md:grid-cols-2">
        <div className="story-image relative">
          <div className="absolute -left-6 -top-6 h-full w-full border border-[rgba(201,168,76,0.3)]" />
          <div className="relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200"
              alt="Fab Shopper store"
              width={600}
              height={780}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="story-text space-y-6">
          <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--brand-gold)]">
            Our Story
          </p>
          <h2
            className="text-[52px] leading-[1.1] text-[var(--brand-green)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            More Than A Store.
            <br />
            A Closet Revolution.
          </h2>
          <p className="text-[16px] leading-8 text-[var(--text-muted)]">
            Fab Shopper is a personal shopping experience rooted in Lekki, Lagos. Founded by a
            stylist who believes fashion should feel effortless, we curate only the best —
            designer shoes, luxury bags, statement clothing, signature perfumes and accessories
            that speak for themselves.
          </p>
          <p className="text-[16px] leading-8 text-[var(--text-muted)]">
            Visit us at Shop A23, Justice Mall, Nnobi Lane, Lekki — or shop online and we&apos;ll bring
            the boutique to your doorstep.
          </p>
          <div>
            <button className="text-sm uppercase tracking-[0.2em] text-[var(--brand-green)] underline">
              Learn More About Us →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
