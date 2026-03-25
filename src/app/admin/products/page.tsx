import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/layout/admin-shell";
import { ProductsPageClient } from "@/components/admin/products/products-page-client";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany();
  
  const totalRetailValue = products.reduce((acc, p) => acc + (Number(p.price) * p.stockQuantity), 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + (Number(p.costPrice || 0) * p.stockQuantity), 0);
  const outOfStock = products.filter(p => p.stockQuantity <= 0).length;

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
    <AdminShell>
      <Suspense fallback={<div className="py-10 text-sm text-forest/60">Loading products…</div>}>
        <ProductsPageClient stats={stats} />
      </Suspense>
    </AdminShell>
  );
}

