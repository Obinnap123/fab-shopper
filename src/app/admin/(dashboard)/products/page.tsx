import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ProductsPageClient } from "@/components/admin/products/products-page-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null }
    });

    const totalRetailValue = products.reduce((acc, p) => acc + (Number(p.price) * p.stockQuantity), 0);
    const totalInventoryValue = products.reduce((acc, p) => acc + (Number(p.costPrice || 0) * p.stockQuantity), 0);
    const outOfStock = products.filter((p) => p.stockQuantity <= 0).length;

    const soldItems = await prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: { order: { status: { in: ["COMPLETED", "SHIPPED"] } } }
    });

    const stats = {
      totalRetailValue,
      totalInventoryValue,
      productsSold: soldItems._sum.quantity || 0,
      outOfStock
    };

    return (
      <Suspense fallback={<div className="py-10 text-sm text-forest/60">Loading products...</div>}>
        <ProductsPageClient stats={stats} />
      </Suspense>
    );
  } catch {
    return (
      <section className="space-y-4">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          We couldn&apos;t load products right now because the database is temporarily unavailable. Please try again in a moment.
        </div>
        <Suspense fallback={<div className="py-10 text-sm text-forest/60">Loading products...</div>}>
          <ProductsPageClient />
        </Suspense>
      </section>
    );
  }
}
