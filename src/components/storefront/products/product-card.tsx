"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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

export function ProductCard({ product, theme = "dark" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden"
      style={{ borderRadius: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.slug}`}>
        <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={product.images[0]}
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

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4"
            animate={{ y: isHovered ? 0 : 16, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fontStyle: "italic",
                color: "#FFFFFF",
                lineHeight: 1.2,
                marginBottom: 4
              }}
            >
              {product.name}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "var(--brand-gold)",
                letterSpacing: "0.05em"
              }}
            >
              {product.discountedPrice ? (
                <>
                  <span>₦{product.discountedPrice.toLocaleString()}</span>
                  <span style={{ textDecoration: "line-through", opacity: 0.6, marginLeft: 8 }}>
                    ₦{product.price.toLocaleString()}
                  </span>
                </>
              ) : (
                <span>₦{product.price.toLocaleString()}</span>
              )}
            </p>
          </motion.div>

          <motion.button
            className="absolute top-4 right-4"
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
            style={{
              background: "var(--brand-gold)",
              color: "var(--brand-green)",
              border: "none",
              borderRadius: 2,
              padding: "8px 14px",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
            onClick={(event) => {
              event.preventDefault();
              addItem({
                id: product.id,
                productId: product.id,
                name: product.name,
                price: product.discountedPrice ?? product.price,
                image: product.images[0],
                slug: product.slug
              });
            }}
          >
            Quick Add
          </motion.button>

          {product.discountedPrice ? (
            <div
              className="absolute top-4 left-4"
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

        <div className="pb-1 pt-3">
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: theme === "dark" ? "rgba(255,255,255,0.85)" : "var(--text-dark)",
              marginBottom: 4,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {product.name}
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--brand-gold)"
            }}
          >
            ₦{(product.discountedPrice || product.price).toLocaleString()}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
