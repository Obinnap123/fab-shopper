"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

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

  const { data: dbCollections = [] } = useQuery({
    queryKey: ["collections-showcase"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      const json = await res.json();
      return json.data || [];
    }
  });

  const fallbackImages: Record<string, string> = {
    "women's shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "bags & purses": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800",
    "clothing": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    "men's shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    "perfumes": "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800",
    "accessories": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800",
    "new arrivals": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
  };

  const displayCollections = dbCollections.length > 0 
    ? dbCollections.map((c: any) => ({
        name: c.name,
        count: `${c._count?.products || 0} Items`,
        image: c.image || fallbackImages[c.name.toLowerCase()] || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
      }))
    : categories;

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
  }, [displayCollections.length]);

  return (
    <section ref={sectionRef} className="bg-[var(--brand-cream)] py-24">
      <div className="mx-auto w-full max-w-7xl px-8">
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
          {displayCollections.map((category: any) => (
            <motion.div
              key={category.name}
              className="category-card group relative overflow-hidden cursor-pointer"
              initial="rest"
              whileHover="hover"
            >
              <div className="relative h-[380px] w-full">
                {/* Image Scale on Hover */}
                <motion.div
                  className="absolute inset-0"
                  variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.07 }
                  }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </motion.div>
                
                {/* Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-[rgba(10,25,15,0.9)] via-[rgba(10,25,15,0.1)] to-transparent"
                  variants={{
                    rest: { opacity: 0.7 },
                    hover: { opacity: 1 }
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />

                {/* Text contents */}
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end">
                  <motion.div
                    variants={{
                      rest: { y: 32 },
                      hover: { y: 0 }
                    }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                  >
                    <p
                      className="text-[32px] text-white leading-none"
                      style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                    >
                      {category.name}
                    </p>
                    
                    {/* Expanding Line */}
                    <motion.div 
                      className="h-[1px] bg-[var(--brand-gold)] mt-4 mb-4 origin-left"
                      variants={{
                        rest: { scaleX: 0, opacity: 0 },
                        hover: { scaleX: 1, opacity: 0.5 }
                      }}
                      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    />
                    
                    {/* Metadata (Count & Arrow) */}
                    <motion.div 
                      className="flex items-center justify-between text-[12px] uppercase tracking-[0.2em] text-[var(--brand-gold)]"
                      variants={{
                        rest: { opacity: 0, y: 10 },
                        hover: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.5, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <span className="font-medium">{category.count}</span>
                      <motion.div
                        variants={{
                          rest: { x: -10, opacity: 0 },
                          hover: { x: 0, opacity: 1 }
                        }}
                        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                      >
                        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 1L23 6M23 6L18 11M23 6L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
