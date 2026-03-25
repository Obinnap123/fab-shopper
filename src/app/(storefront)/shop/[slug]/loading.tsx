import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="bg-[var(--brand-cream)] px-6 py-16 min-h-[80vh] flex flex-col">
      <PageSpacer />
      <div className="mx-auto w-full max-w-6xl flex-1 mt-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          {/* Image Gallery Skeleton */}
          <div className="w-full md:w-1/2 flex gap-4">
            <div className="hidden sm:flex flex-col gap-4 w-20 lg:w-24">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-[3/4] w-full" />
              ))}
            </div>
            <Skeleton className="aspect-[3/4] flex-1" />
          </div>

          {/* Product Details Skeleton */}
          <div className="w-full md:w-1/2 space-y-8 mt-4 md:mt-0">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 md:h-12 w-3/4" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="space-y-4 pt-6">
              <Skeleton className="h-6 w-20" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-16" />
                ))}
              </div>
            </div>
            <Skeleton className="h-12 w-full mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
