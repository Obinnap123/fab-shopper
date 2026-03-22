"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PageSpacer } from "@/components/storefront/layout/page-spacer";

export default function OrderConfirmationPage() {
  return (
    <>
      <PageSpacer />
      <div className="flex min-h-[80vh] items-center justify-center bg-[var(--brand-green)] px-8 py-20 text-center text-white">
        <div className="w-full max-w-xl space-y-6">
        <motion.svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            stroke="var(--brand-gold)"
            strokeWidth="4"
          />
          <motion.path
            d="M38 62l14 14 30-34"
            stroke="var(--brand-gold)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>

        <h1
          className="text-[48px] text-[var(--brand-gold)]"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
        >
          Order Confirmed!
        </h1>
        <p className="text-sm text-white/75">
          Thank you for shopping with Fab Shopper. Your order has been received and is being
          processed.
        </p>

        <div className="rounded border border-[rgba(201,168,76,0.35)] px-6 py-4 text-sm text-white/80">
          <p>Order Number: #FAB-00247</p>
          <p>Date: 14 March 2025</p>
          <p>Payment: Paid via Paystack</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/shop"
            className="border border-[var(--brand-gold)] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[var(--brand-gold)]"
          >
            Track Order
          </Link>
          <Link
            href="/shop"
            className="bg-[var(--brand-gold)] px-6 py-3 text-xs uppercase tracking-[0.2em] text-[var(--brand-green)]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
