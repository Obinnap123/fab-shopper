import { PageSpacer } from "@/components/storefront/layout/page-spacer";

export default function Loading() {
  return (
    <div className="bg-[var(--brand-cream)] px-6 py-16 min-h-[80vh] flex flex-col">
      <PageSpacer />
      <div className="mx-auto w-full max-w-6xl animate-pulse flex-1 flex flex-col justify-center items-center">
        <p className="text-[var(--brand-green)] opacity-50 uppercase tracking-[0.2em] text-sm">Loading details...</p>
      </div>
    </div>
  );
}
