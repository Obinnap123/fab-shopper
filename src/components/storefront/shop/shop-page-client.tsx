"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { ProductFilters } from "@/components/storefront/products/product-filters";
import { ProductGrid } from "@/components/storefront/products/product-grid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  search: "",
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
    const search = searchParams.get("q") ?? "";

    setFilters((prev) => ({
      ...prev,
      category: paramCategory ? paramCategory.split(",") : [],
      minPrice,
      maxPrice,
      search
    }));
    setSort(sortParam);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category.length) params.set("category", filters.category.join(","));
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.search) params.set("q", filters.search);
    if (sort !== "newest") params.set("sort", sort);
    router.replace(`/shop?${params.toString()}`);
  }, [filters, sort, router]);

  const { data } = useQuery({
    queryKey: ["shop-products", filters.minPrice, filters.maxPrice, sort, filters.search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("sort", sort);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
      if (filters.search) params.set("search", filters.search);
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
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-8 pt-12 md:grid-cols-[280px_1fr]">
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
              <Select value={sort} onValueChange={(value) => setSort(value)}>
                <SelectTrigger className="w-[180px] rounded-full border border-[rgba(26,60,46,0.2)] bg-transparent px-4 h-9 text-sm text-[var(--text-dark)] shadow-none focus:ring-1 focus:ring-[var(--brand-gold)] hide-ring-offset outline-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border border-[rgba(26,60,46,0.1)] bg-white shadow-xl">
                  <SelectItem value="newest" className="cursor-pointer focus:bg-[var(--brand-cream)] focus:text-[var(--brand-green)] rounded-xl my-0.5">Latest</SelectItem>
                  <SelectItem value="price-asc" className="cursor-pointer focus:bg-[var(--brand-cream)] focus:text-[var(--brand-green)] rounded-xl my-0.5">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc" className="cursor-pointer focus:bg-[var(--brand-cream)] focus:text-[var(--brand-green)] rounded-xl my-0.5">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ProductGrid products={filteredProducts} theme="light" />
        </section>
      </div>
    </div>
  );
}

