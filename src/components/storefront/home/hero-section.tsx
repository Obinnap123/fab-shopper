"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export function HeroSection() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        minHeight: 600,
        overflow: "hidden",
        marginTop: 0,
      }}
    >
      <Image
        src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=85"
        alt="Fab Shopper — Delight Closet Revolution"
        fill
        priority
        quality={85}
        style={{ objectFit: "cover", objectPosition: "center top" }}
        sizes="100vw"
      />

      {/* 
        Single sleek gradient overlay matching shoptobiri.com details
        (Transitioning strictly from dark bottom to transparent middle) 
      */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 30%, transparent 100%)",
        }}
      />

      {/* Optional very-light dim overall to guarantee high contrast across all devices */}
      <div className="absolute inset-0 bg-black/10" />

      {/* HERO CONTENT - Positioned to share absolute exact padded axis with Navbar */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-16 left-0 right-0 mx-auto w-full max-w-7xl px-8"
      >
        <motion.p
          variants={itemVariants}
          className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-gold)] mb-4 opacity-90"
        >
          New Collection · 2025
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-display italic text-white"
          style={{
            fontSize: "clamp(56px, 7vw, 96px)", 
            fontWeight: 400,
            lineHeight: 0.92,
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}
        >
          Delight
          <br />
          <span className="text-[var(--brand-gold)]">Closet</span>
          <br />
          Revolution
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-end justify-between gap-8"
        >
          <p className="font-body text-[15px] leading-[1.6] text-white/75 sm:max-w-[400px]">
            Premium fashion, curated for you. Designer shoes, bags, clothing and
            accessories — delivered to your door in Lagos.
          </p>

          {/* CTA Buttons - Refined minimal aesthetic */}
          <div className="flex shrink-0 gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center rounded bg-white px-8 py-3.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-black transition-transform hover:-translate-y-0.5"
            >
              Shop Now
            </Link>

            <Link
              href="/collections/new-arrivals"
              className="inline-flex items-center rounded border border-white/50 bg-transparent px-8 py-3.5 font-body text-[12px] font-medium uppercase tracking-[0.1em] text-white transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white/10"
            >
              Discover
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-[24px] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[6px]"
      >
        <p className="font-body text-[9px] uppercase tracking-[0.2em] text-white/50 m-0">
          Scroll
        </p>
        <div className="relative h-[40px] w-[1px] overflow-hidden bg-white/20">
          <motion.div
            animate={{ y: [-40, 40] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="absolute left-0 right-0 top-0 h-[60%] bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}
