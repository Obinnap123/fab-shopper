"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type StatsCardProps = {
  label: string;
  value: number;
  format?: "number" | "currency";
  subtitle?: string;
};

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
});

export function StatsCard({ label, value, format = "number", subtitle }: StatsCardProps) {
  const valueRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!valueRef.current) return;
    const context = gsap.context(() => {
      const counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (!valueRef.current) return;
          const raw = Math.round(counter.val);
          valueRef.current.textContent =
            format === "currency" ? nairaFormatter.format(raw) : raw.toLocaleString();
        }
      });
    });

    return () => context.revert();
  }, [value, format]);

  return (
    <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_15px_40px_rgba(26,60,46,0.08)]">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-forest">
        <span ref={valueRef}>0</span>
      </p>
      {subtitle ? <p className="mt-2 text-sm text-forest/50">{subtitle}</p> : null}
    </div>
  );
}
