"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { buildCartLineId } from "@/lib/cart-item";
import { formatAvailableStockMessage } from "@/lib/stock-messages";
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
  { title: "Shipping & Delivery", key: "shipping" },
  { title: "Returns & Exchange Policy", key: "returns" }
];

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getItemQuantity = useCartStore((state) => state.getItemQuantity);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  // Ensure we have valid numbers and handle zero prices correctly
  const validPrice = typeof product.price === 'number' && product.price > 0 ? product.price : 0;
  const validDiscountedPrice = (typeof product.discountedPrice === 'number' && product.discountedPrice > 0) ? product.discountedPrice : null;
  const cartPrice = validDiscountedPrice ?? validPrice;

  const sizes = useMemo(() => {
    const normalized = product.variants
      ?.map((variant) => variant.size?.trim() ?? "")
      .filter((size) => size.length > 0)
      .filter((size) => size.toLowerCase() !== "one size");

    return Array.from(new Set(normalized ?? []));
  }, [product.variants]);
  const colors = useMemo(() => {
    const normalized = product.variants
      ?.flatMap((variant) =>
        (variant.color ?? "")
          .split(",")
          .map((color) => color.trim())
          .filter((color) => color.length > 0)
      )
      .filter((color) => color.length > 0);

    return Array.from(new Set(normalized ?? []));
  }, [product.variants]);
  const cartLineId = buildCartLineId(product.id);
  const quantityInCart = hasHydrated ? getItemQuantity(product.id) : 0;
  const hasItemInCart = quantityInCart > 0;

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (hasItemInCart) {
      setQuantity(quantityInCart);
      return;
    }

    setQuantity((current) => Math.max(1, Math.min(current, Math.max(product.stockQuantity, 1))));
  }, [hasHydrated, hasItemInCart, product.stockQuantity, quantityInCart]);

  const handleIncreaseQuantity = () => {
    const nextQuantity = quantity + 1;

    if (nextQuantity > product.stockQuantity) {
      toast.error(formatAvailableStockMessage(product.stockQuantity));
      return;
    }

    if (hasItemInCart) {
      const result = updateQuantity(cartLineId, nextQuantity);
      if (!result.ok && result.message) {
        toast.error(result.message);
      }
      setQuantity(result.quantity);
      return;
    }

    setQuantity(nextQuantity);
  };

  const handleDecreaseQuantity = () => {
    const nextQuantity = Math.max(1, quantity - 1);

    if (hasItemInCart) {
      const result = updateQuantity(cartLineId, nextQuantity);
      setQuantity(result.quantity);
      return;
    }

    setQuantity(nextQuantity);
  };

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) {
      toast.error(formatAvailableStockMessage(product.stockQuantity));
      return;
    }

    if (hasItemInCart) {
      const result = updateQuantity(cartLineId, quantity);
      if (!result.ok && result.message) {
        toast.error(result.message);
      }
      setQuantity(result.quantity);
      return;
    }

    const result = addItem({
      id: cartLineId,
      productId: product.id,
      name: product.name,
      price: cartPrice,
      image: product.images[0],
      slug: product.slug,
      quantity,
      stockQuantity: product.stockQuantity
    });

    if (!result.ok && result.message) {
      toast.error(result.message);
      setQuantity(Math.max(1, Math.min(result.quantity || 1, Math.max(product.stockQuantity, 1))));
      return;
    }

    setQuantity(1);
  };

  return (
    <div className="grid gap-12 md:grid-cols-2">
      {/* Left: Product Images */}
      <div className="space-y-4">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[var(--brand-cream-dark)]">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Image Thumbnails */}
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((img) => (
            <button
              key={img}
              onClick={() => setActiveImage(img)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition ${
                activeImage === img
                  ? "border-[var(--brand-gold)]"
                  : "border-transparent hover:border-[rgba(201,168,76,0.5)]"
              }`}
            >
              <Image src={img} alt="Thumbnail" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col space-y-6">
        {/* Header with Heart */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </p>
            <h1
              className="text-[42px] font-light text-[var(--brand-green)]"
              style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
            >
              {product.name}
            </h1>
          </div>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="flex-shrink-0"
          >
            <Heart
              size={28}
              style={{
                color: isWishlisted ? "var(--brand-gold)" : "var(--brand-green)",
                fill: isWishlisted ? "var(--brand-gold)" : "none",
                strokeWidth: 1.5
              }}
            />
          </button>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="text-[32px] font-semibold text-[var(--brand-gold)]">
            ₦{cartPrice.toLocaleString()}
          </div>
          {validDiscountedPrice && (
            <p className="text-sm text-[var(--text-muted)] line-through">
              ₦{validPrice.toLocaleString()}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(201,168,76,0.2)]" />

        {/* Size Selection */}
        {sizes.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.15em] text-[var(--brand-green)]">
              Size
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="rounded-sm border border-[rgba(26,60,46,0.3)] px-4 py-2 text-sm uppercase tracking-[0.08em] transition hover:border-[var(--brand-gold)] hover:bg-[rgba(201,168,76,0.05)]"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {colors.length > 0 && (
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.15em] text-[var(--brand-green)]">
              Color
            </label>
            <p className="text-sm text-[var(--text-muted)]">{colors.join(", ")}</p>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-[0.15em] text-[var(--brand-green)]">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDecreaseQuantity}
              className="flex h-10 w-10 items-center justify-center rounded border border-[rgba(26,60,46,0.2)] text-lg font-light"
            >
              −
            </button>
            <span className="text-lg font-medium w-6 text-center">{quantity}</span>
            <button
              onClick={handleIncreaseQuantity}
              className="flex h-10 w-10 items-center justify-center rounded border border-[rgba(26,60,46,0.2)] text-lg font-light"
            >
              +
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {!hasHydrated
              ? `${product.stockQuantity} of ${product.stockQuantity} available for this item right now.`
              : product.stockQuantity > 0
              ? `${quantity} selected. ${product.stockQuantity} available in stock.`
              : "Currently out of stock."}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(201,168,76,0.2)]" />

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockQuantity <= 0}
          className="w-full bg-[var(--brand-gold)] py-3 text-sm uppercase tracking-[0.12em] font-semibold text-[var(--brand-green)] transition hover:opacity-90"
        >
          {hasItemInCart ? "Update Cart" : "Add to Cart"}
        </button>

        {/* Accordion Section */}
        <div className="space-y-0">
          {accordionItems.map((item) => (
            <div key={item.key} className="border-b border-[rgba(201,168,76,0.2)]">
              <button
                onClick={() => setActiveAccordion(activeAccordion === item.key ? null : item.key)}
                className="flex w-full items-center justify-between py-3 text-sm uppercase tracking-[0.08em] text-[var(--brand-green)] transition hover:text-[var(--brand-gold)]"
              >
                <span>{item.title}</span>
                <span className="text-lg">{activeAccordion === item.key ? "−" : "+"}</span>
              </button>
              <AnimatePresence>
                {activeAccordion === item.key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-3 text-sm text-[var(--text-muted)]">
                      {item.key === "description" && (product.longDescription || product.shortDescription)}
                      {item.key === "shipping" && "Within Lagos: ₦4,500 • Abuja: ₦7,500 • Other states: from ₦6,500 • Pick up: Free"}
                      {item.key === "returns" && "No return policy"}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
