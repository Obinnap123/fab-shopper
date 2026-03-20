import { Suspense } from "react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { ProductsPageClient } from "@/components/admin/products/products-page-client";

export default function ProductsPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="py-10 text-sm text-forest/60">Loading products…</div>}>
        <ProductsPageClient />
      </Suspense>
    </AdminShell>
  );
}

