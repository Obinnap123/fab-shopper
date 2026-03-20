"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ProductFilters } from "@/components/storefront/products/product-filters";
import { ProductGrid } from "@/components/storefront/products/product-grid";

type Product = {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number | null;
  images: string[];
  slug: string;
  collections?: { name: string }[];
};

const defaultFilters = {
  category: [] as string[],
  size: [] as string[],
  color: [] as string[],
  minPrice: "",
  maxPrice: "",
  style: [] as string[],
  occasion: [] as string[]
};

export function ShopPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState("newest");

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    const paramCategory = searchParams.get("category");
    const minPrice = searchParams.get("minPrice") ?? "";
    const maxPrice = searchParams.get("maxPrice") ?? "";
    const sortParam = searchParams.get("sort") ?? "newest";

    setFilters((prev) => ({
      ...prev,
      category: paramCategory ? paramCategory.split(",") : [],
      minPrice,
      maxPrice
    }));
    setSort(sortParam);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category.length) params.set("category", filters.category.join(","));
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (sort !== "newest") params.set("sort", sort);
    router.replace(`/shop?${params.toString()}`);
  }, [filters, sort, router]);

  const { data } = useQuery({
    queryKey: ["shop-products", filters.minPrice, filters.maxPrice, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      return json.data as Product[];
    }
  });

  const filteredProducts = useMemo(() => {
    const products = data ?? [];
    if (!filters.category.length) return products;

    return products.filter((product) => {
      const collectionNames = product.collections?.map((collection) => collection.name) ?? [];
      return filters.category.some((category) =>
        collectionNames.some((name) => name.toLowerCase().includes(category.toLowerCase()))
      );
    });
  }, [data, filters.category]);

  return (
    <div className="bg-[var(--brand-cream)] pb-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 pt-12 md:grid-cols-[280px_1fr]">
        <aside className="hidden md:block">
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            onClear={() => setFilters(defaultFilters)}
          />
        </aside>

        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
            <span>Showing {filteredProducts.length} products</span>
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-full border border-[rgba(26,60,46,0.2)] bg-transparent px-4 py-2 text-sm text-[var(--text-dark)]"
              >
                <option value="newest">Latest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          <ProductGrid products={filteredProducts} theme="light" />
        </section>
      </div>
    </div>
  );
}

