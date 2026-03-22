"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { ProductCard } from "@/components/storefront/products/product-card";

type Product = {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  slug: string;
};

export function NewArrivalsSection() {
  const { data } = useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      const res = await fetch("/api/products?sort=newest&limit=8");
      const json = await res.json();
      return (json.data ?? []) as Product[];
    },
    staleTime: 1000 * 60 * 5
  });

  const products = data ?? [];

  return (
    <section className="bg-[var(--brand-green)] py-24 text-white">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--brand-gold)]">Just Arrived</p>
            <h2
              className="mt-3 text-[52px] text-[var(--brand-gold)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              New This Week
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm uppercase tracking-[0.2em] text-[var(--brand-gold)] hover:underline"
          >
            View All {"->"}
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} theme="dark" />
          ))}
        </div>
      </div>
    </section>
  );
}
