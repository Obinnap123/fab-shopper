import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const bestSellers = [
  { name: "Palm Silk Set", revenue: "?480,000", units: 12 },
  { name: "Zina Maxi Dress", revenue: "?375,000", units: 9 }
];

export default function AnalyticsProductsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Analytics"
          title="Product Performance"
          subtitle="Top selling items and revenue drivers."
        />

        <SectionCard title="Best Sellers">
          <div className="space-y-3">
            {bestSellers.map((product) => (
              <div key={product.name} className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3">
                <div>
                  <p className="font-semibold text-forest">{product.name}</p>
                  <p className="text-sm text-forest/60">{product.units} units</p>
                </div>
                <p className="text-sm font-semibold text-forest">{product.revenue}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
