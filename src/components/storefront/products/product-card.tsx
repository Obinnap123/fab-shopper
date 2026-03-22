"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discountedPrice?: number | null;
    images: string[];
    slug: string;
  };
  theme?: "dark" | "light";
}

const fallbackImage = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800";

export function ProductCard({ product, theme = "dark" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const primaryImage = product.images[0] || fallbackImage;
  
  // Ensure we have valid numbers and handle zero prices correctly
  const validPrice = typeof product.price === 'number' && product.price > 0 ? product.price : 0;
  const validDiscountedPrice = (typeof product.discountedPrice === 'number' && product.discountedPrice > 0) ? product.discountedPrice : null;
  const displayPrice = validDiscountedPrice ?? validPrice;
  const formatCurrency = (value: number) => `NGN ${value.toLocaleString("en-NG")}`;

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden"
      style={{ borderRadius: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,25,15,0.85) 0%, rgba(10,25,15,0.2) 50%, transparent 100%)"
          }}
          animate={{ opacity: isHovered ? 1 : 0.3 }}
          transition={{ duration: 0.4 }}
        />

        {/* Heart Icon - Top Right on Hover */}
        <motion.button
          className="absolute right-4 top-4 z-10"
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Heart
            size={24}
            style={{
              color: isWishlisted ? "var(--brand-gold)" : "var(--brand-gold)",
              fill: isWishlisted ? "var(--brand-gold)" : "none",
              stroke: "currentColor",
              strokeWidth: 1.5
            }}
          />
        </motion.button>

        {/* Select Options Button - Bottom on Hover */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 z-10"
          animate={{ y: isHovered ? 0 : 16, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Link href={`/shop/${product.slug}`}>
            <button
              style={{
                background: "var(--brand-gold)",
                color: "var(--brand-green)",
                border: "none",
                borderRadius: 2,
                padding: "12px 16px",
                fontFamily: "var(--font-body)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
                width: "100%",
                textAlign: "center"
              }}
            >
              Select Options
            </button>
          </Link>
        </motion.div>

        {/* Sale Badge */}
        {validDiscountedPrice ? (
          <div
            className="absolute left-4 top-4 z-10"
            style={{
              background: "var(--brand-gold)",
              color: "var(--brand-green)",
              padding: "4px 10px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: 2
            }}
          >
            Sale
          </div>
        ) : null}
      </div>

      {/* Product Info - Always Visible at Bottom */}
      <Link href={`/shop/${product.slug}`}>
        <div className="pt-3 pb-1">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 500,
              color: theme === "dark" ? "rgba(255,255,255,0.85)" : "var(--text-dark)",
              marginBottom: 2,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              lineHeight: 1.4
            }}
          >
            {product.name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--brand-gold)"
            }}
          >
            {formatCurrency(displayPrice)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
