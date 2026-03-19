"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { useCartStore } from "@/stores/cartStore";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  stockQuantity: number;
  shortDescription?: string | null;
  longDescription?: string | null;
  variants?: { size?: string | null; color?: string | null }[];
};

const accordionItems = [
  { title: "Product Description", key: "description" },
  { title: "Size Guide", key: "size" },
  { title: "Shipping & Delivery", key: "shipping" },
  { title: "Returns & Exchange Policy", key: "returns" }
];

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const sizes = useMemo(
    () =>
      Array.from(new Set(product.variants?.map((variant) => variant.size).filter(Boolean))) as string[],
    [product.variants]
  );
  const colors = useMemo(
    () =>
      Array.from(new Set(product.variants?.map((variant) => variant.color).filter(Boolean))) as string[],
    [product.variants]
  );

  return (
    <div className="grid gap-10 md:grid-cols-[55%_45%]">
      <div className="space-y-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[var(--brand-cream-dark)]">
          <Image src={activeImage} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {product.images.map((img) => (
            <button
              key={img}
              className={`relative h-20 w-20 overflow-hidden rounded-md border ${
                activeImage === img ? "border-[var(--brand-gold)]" : "border-transparent"
              }`}
              onClick={() => setActiveImage(img)}
            >
              <Image src={img} alt="Thumbnail" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="sticky top-32 space-y-6 self-start">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Home › Shoes › Women&apos;s Shoes
        </p>
        <h1
          className="text-[38px] text-[var(--brand-green)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {product.name}
        </h1>
        <div className="text-[24px] text-[var(--brand-gold)]">
          {product.discountedPrice ? (
            <>
              <span className="font-semibold">₦{product.discountedPrice.toLocaleString()}</span>
              <span className="ml-3 text-sm text-[var(--text-muted)] line-through">
                ₦{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="font-semibold">₦{product.price.toLocaleString()}</span>
          )}
        </div>

        {product.stockQuantity <= 3 ? (
          <p className="text-sm text-red-600">Only {product.stockQuantity} left!</p>
        ) : (
          <p className="text-sm text-emerald-600">In Stock</p>
        )}

        <div className="h-px bg-[rgba(201,168,76,0.2)]" />

        {sizes.length ? (
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="rounded-full border border-[rgba(26,60,46,0.2)] px-4 py-2 text-xs"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {colors.length ? (
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Color</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {colors.map((color) => (
                <span
                  key={color}
                  className="h-7 w-7 rounded-full border border-[var(--brand-gold)]"
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--text-muted)]">Quantity</p>
          <div className="mt-3 flex items-center gap-3">
            <button
              className="h-9 w-9 rounded-full border border-[rgba(26,60,46,0.2)]"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              −
            </button>
            <span className="text-sm">{quantity}</span>
            <button
              className="h-9 w-9 rounded-full border border-[rgba(26,60,46,0.2)]"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
        </div>

        <button
          className="h-14 w-full bg-[var(--brand-gold)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)]"
          onClick={() =>
            addItem({
              id: product.id,
              productId: product.id,
              name: product.name,
              price: product.discountedPrice ?? product.price,
              image: product.images[0],
              slug: product.slug
            })
          }
        >
          Add to Cart
        </button>
        <button className="h-13 w-full border border-[var(--brand-gold)] bg-[var(--brand-green)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-gold)]">
          Buy Now
        </button>

        <div className="space-y-3 pt-2">
          {accordionItems.map((item) => (
            <div key={item.key} className="border-b border-[rgba(201,168,76,0.2)] pb-3">
              <button
                className="flex w-full items-center justify-between text-sm text-[var(--brand-green)]"
                onClick={() => setActiveAccordion(activeAccordion === item.key ? null : item.key)}
              >
                {item.title}
                <span>{activeAccordion === item.key ? "−" : "+"}</span>
              </button>
              <AnimatePresence>
                {activeAccordion === item.key ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 text-sm text-[var(--text-muted)]">
                      {item.key === "description" && (product.longDescription || product.shortDescription)}
                      {item.key === "size" && "Size guidance coming soon."}
                      {item.key === "shipping" && "Within Lagos: ₦4,500 • Abuja: ₦7,500 • Other states: from ₦6,500 • Pick up: Free"}
                      {item.key === "returns" && "Returns are accepted within 7 days of delivery."}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
