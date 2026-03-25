import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="relative overflow-hidden w-full">
      <div className="relative overflow-hidden w-full rounded-[4px]" style={{ aspectRatio: "3/4" }}>
        <Skeleton className="absolute inset-0 w-full h-full rounded-[4px]" />
      </div>
      <div className="pt-3 pb-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
