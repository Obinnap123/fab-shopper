import { Suspense } from "react";

import { ShopPageClient } from "@/components/storefront/shop/shop-page-client";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="px-6 py-16 text-sm text-[var(--text-muted)]">Loading shop…</div>}>
      <ShopPageClient />
    </Suspense>
  );
}

