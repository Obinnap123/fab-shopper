"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Package, Plus, Tag, Wallet } from "lucide-react";

import { ProductsClient } from "@/components/admin/products/products-client";
import { CollectionsClient } from "@/components/admin/products/collections-client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

type ProductStats = {
  totalRetailValue: number;
  totalInventoryValue: number;
  productsSold: number;
  outOfStock: number;
};

export function ProductsPageClient({ stats = {
  totalRetailValue: 0,
  totalInventoryValue: 0,
  productsSold: 0,
  outOfStock: 0
} }: { stats?: ProductStats }) {
  const [activeTab, setActiveTab] = useState("products");

  const formatCurrency = (val: number) => `₦${val.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-forest">Products</h1>
        <div className="flex items-center gap-3">
          <Select defaultValue="Actions">
            <SelectTrigger className="h-10 rounded-full border border-forest/40 bg-forest/5 px-5 text-xs font-semibold uppercase tracking-[0.1em] text-forest transition-colors hover:bg-forest/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Actions">Actions</SelectItem>
              <SelectItem value="Export">Export</SelectItem>
              <SelectItem value="Bulk Publish">Bulk Publish</SelectItem>
            </SelectContent>
          </Select>
          <Button
            asChild
            className="flex h-10 items-center gap-2 rounded-full bg-forest px-6 font-semibold text-white hover:bg-forest/90"
          >
            <Link href="/admin/products/create">
              <Plus className="h-4 w-4" />
              Add New Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Retail Value",
            value: formatCurrency(stats.totalRetailValue),
            icon: Wallet,
            tone: "bg-emerald-50 text-emerald-600"
          },
          {
            label: "Total Cost Value",
            value: formatCurrency(stats.totalInventoryValue),
            icon: Box,
            tone: "bg-sky-50 text-sky-600"
          },
          {
            label: "Products Sold",
            value: stats.productsSold.toString(),
            icon: Tag,
            tone: "bg-rose-50 text-rose-600"
          },
          {
            label: "Out of Stock",
            value: stats.outOfStock.toString(),
            icon: Package,
            tone: "bg-amber-50 text-amber-600"
          }
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)] transition-all duration-200 hover:shadow-[0_16px_40px_rgba(26,60,46,0.12)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-forest">{stat.value}</p>
              </div>
              <span className={`flex-shrink-0 rounded-2xl p-3 ${stat.tone}`}>
                <stat.icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === "products"
              ? "bg-forest text-white"
              : "border border-forest/10 text-forest/70 hover:border-forest/20 hover:text-forest"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("collections")}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
            activeTab === "collections"
              ? "bg-forest text-white"
              : "border border-forest/10 text-forest/70 hover:border-forest/20 hover:text-forest"
          }`}
        >
          Collections
        </button>
      </div>

      <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)] overflow-x-auto min-w-0">
        {activeTab === "products" ? <ProductsClient /> : <CollectionsClient />}
      </div>
    </section>
  );
}

