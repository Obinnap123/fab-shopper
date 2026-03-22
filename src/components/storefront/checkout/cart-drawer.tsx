"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useCartStore } from "@/stores/cartStore";

export function CartDrawer() {
  const { isOpen, closeCart, items, total, itemCount, updateQuantity, removeItem } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[rgba(10,25,15,0.5)]"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 z-[100] h-full w-full max-w-[420px] bg-[var(--brand-cream)] shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-[rgba(26,60,46,0.1)] px-6 py-5">
                <p className="text-lg font-semibold text-[var(--brand-green)]">
                  Your Cart ({itemCount()})
                </p>
                <button onClick={closeCart} className="rounded-full p-2 text-[var(--brand-green)]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                {items.length ? (
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-white">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[var(--text-dark)]">{item.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {item.size ? `Size: ${item.size}` : ""}
                            {item.color ? ` • Color: ${item.color}` : ""}
                          </p>
                          <p className="mt-2 text-sm text-[var(--brand-gold)]">
                            ₦{item.price.toLocaleString()}
                          </p>
                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-[rgba(26,60,46,0.15)]">
                              <button
                                className="px-3 py-1 text-sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                −
                              </button>
                              <span className="px-3 text-sm">{item.quantity}</span>
                              <button
                                className="px-3 py-1 text-sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="text-xs uppercase tracking-[0.2em] text-[var(--brand-green)]"
                              onClick={() => removeItem(item.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">Your cart is empty.</p>
                )}
              </div>

              <div className="border-t border-[rgba(26,60,46,0.1)] px-6 py-6">
                <div className="space-y-3 text-sm text-[var(--text-muted)]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{total().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%)</span>
                    <span>₦{Math.round(total() * 0.075).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[rgba(26,60,46,0.1)] pt-4 text-sm font-semibold text-[var(--brand-green)]">
                  <span>Estimated Total</span>
                  <span>₦{Math.round(total() * 1.075).toLocaleString()}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-4 flex h-14 w-full items-center justify-center rounded-none bg-[var(--brand-gold)] text-[13px] uppercase tracking-[0.12em] text-[var(--brand-green)]"
                  onClick={closeCart}
                >
                  Proceed to Checkout
                </Link>
                <button
                  className="mt-3 text-xs uppercase tracking-[0.2em] text-[var(--brand-green)]"
                  onClick={closeCart}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
