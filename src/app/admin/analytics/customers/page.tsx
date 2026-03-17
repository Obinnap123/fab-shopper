import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

export default function AnalyticsCustomersPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Analytics"
          title="Customer Analytics"
          subtitle="Track new vs returning customers and lifetime value."
        />

        <SectionCard title="Customer Insights" subtitle="Compare last 30 days">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-forest/10 p-4">
              <p className="text-sm text-forest/60">New Customers</p>
              <p className="mt-2 text-xl font-semibold text-forest">86</p>
            </div>
            <div className="rounded-2xl border border-forest/10 p-4">
              <p className="text-sm text-forest/60">Repeat Customers</p>
              <p className="mt-2 text-xl font-semibold text-forest">42</p>
            </div>
            <div className="rounded-2xl border border-forest/10 p-4">
              <p className="text-sm text-forest/60">Avg. LTV</p>
              <p className="mt-2 text-xl font-semibold text-forest">?74,000</p>
            </div>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
