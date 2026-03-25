import { ProductSkeleton } from "@/components/storefront/products/product-skeleton";

export default function ShopLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Title Area Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-48 bg-black/10 dark:bg-white/10 rounded animate-pulse mb-4" />
        <div className="h-4 w-96 max-w-full bg-black/10 dark:bg-white/10 rounded animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar Skeleton - Hidden on mobile, visible on lg */}
        <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <div className="h-6 w-24 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 w-full bg-black/10 dark:bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="flex-1">
          {/* Controls Bar Skeleton */}
          <div className="flex justify-between mb-6">
            <div className="h-10 w-32 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-48 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
