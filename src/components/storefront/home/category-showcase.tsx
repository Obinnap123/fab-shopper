"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { name: "Women's Shoes", count: "24 Items", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" },
  { name: "Bags & Purses", count: "18 Items", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800" },
  { name: "Clothing", count: "32 Items", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800" },
  { name: "Men's Shoes", count: "16 Items", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" },
  { name: "Perfumes & Fragrance", count: "12 Items", image: "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800" },
  { name: "Accessories", count: "20 Items", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800" }
];

export function CategoryShowcase() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll(".category-card");

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%"
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="bg-[var(--brand-cream)] py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--brand-gold)]">
            Shop By Category
          </p>
          <h2
            className="mt-3 text-[52px] text-[var(--brand-green)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything You Need
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              className="category-card group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className={`relative w-full ${index % 2 === 0 ? "h-[380px]" : "h-[420px]"}`}>
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,25,15,0.85)] via-[rgba(10,25,15,0.2)] to-transparent" />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6"
                  whileHover={{ y: -4 }}
                >
                  <p
                    className="text-[28px] text-white"
                    style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                  >
                    {category.name}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[12px] uppercase tracking-[0.2em] text-[var(--brand-gold)]">
                    <span>{category.count}</span>
                    <span>→</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
