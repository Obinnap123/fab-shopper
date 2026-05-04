"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageSpacer } from "@/components/storefront/layout/page-spacer";

type OrderSummary = {
  id: string;
  orderNumber: string;
  paymentStatus: string;
  status: string;
  total: string | number;
  createdAt: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
};

export default function OrderConfirmationPage() {
  const params = useParams<{ id: string }>();
  const orderId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      if (!orderId) {
        setError("Missing order reference.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unable to load order details");
        }

        if (!cancelled) {
          setOrder(data.data as OrderSummary);
          setError(null);
        }
      } catch (fetchError: any) {
        if (!cancelled) {
          setError(fetchError?.message || "Unable to load order details");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const displayTotal = (value: string | number | undefined) => {
    const amount = Number(value ?? 0);
    return `NGN ${amount.toLocaleString()}`;
  };

  const displayDate = (value: string | undefined) => {
    if (!value) return "";
    const date = new Date(value);
    return new Intl.DateTimeFormat("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

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
            {loading ? "Confirming Order..." : "Order Confirmed!"}
          </h1>

          <p className="text-sm text-white/75">
            {loading
              ? "Please wait while we load your verified order details."
              : "Thank you for shopping with Fab Shopper. Your order has been received and is being processed."}
          </p>

          {error ? (
            <div className="rounded border border-rose-300/40 bg-rose-500/10 px-6 py-4 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {order && !error ? (
            <div className="rounded border border-[rgba(201,168,76,0.35)] px-6 py-4 text-sm text-white/80">
              <p>Order Number: #{order.orderNumber}</p>
              <p>Date: {displayDate(order.createdAt)}</p>
              <p>Payment: {order.paymentStatus === "PAID" ? "Paid via Paystack" : "Payment pending"}</p>
              <p>Total: {displayTotal(order.total)}</p>
              <p>Status: {order.status}</p>
            </div>
          ) : null}

          {!loading && !order && !error ? (
            <div className="rounded border border-[rgba(201,168,76,0.35)] px-6 py-4 text-sm text-white/80">
              Order details could not be loaded.
            </div>
          ) : null}

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
