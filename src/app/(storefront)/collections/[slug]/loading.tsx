import { ProductSkeleton } from "@/components/storefront/products/product-skeleton";

export default function CollectionLoading() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Title and Description Skeleton */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <div className="h-12 w-64 bg-black/10 dark:bg-white/10 rounded animate-pulse mx-auto mb-4" />
        <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded animate-pulse mx-auto mb-2" />
        <div className="h-4 w-3/4 bg-black/10 dark:bg-white/10 rounded animate-pulse mx-auto" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar Skeleton */}
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
          <div className="flex justify-between mb-6">
            <div className="h-10 w-32 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-48 bg-black/10 dark:bg-white/10 rounded animate-pulse" />
          </div>

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
