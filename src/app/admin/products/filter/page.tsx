import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const filters = {
  Sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  Colors: ["Emerald", "Gold", "Ivory", "Noir"],
  Material: ["Silk", "Crepe", "Linen", "Cotton"],
  Occasion: ["Work", "Evening", "Weekend", "Travel"],
  Fit: ["Relaxed", "Tailored", "Oversized"]
};

export default function ProductFilterPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Products"
          title="Product Filters"
          subtitle="Manage filter options used across the storefront."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {Object.entries(filters).map(([key, values]) => (
            <SectionCard key={key} title={key}>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-forest/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-forest/70"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
