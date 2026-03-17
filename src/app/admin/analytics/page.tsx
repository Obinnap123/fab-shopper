import { AdminShell } from "@/components/admin/layout/admin-shell";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { AnalyticsChart } from "@/components/admin/analytics/analytics-chart";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

export default function AnalyticsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Analytics"
          title="Sales Analytics"
          subtitle="Track performance and compare periods."
        />

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard label="Total Sales" value={2480000} format="currency" />
          <StatsCard label="Gross Profit" value={880000} format="currency" />
          <StatsCard label="Shipping Spend" value={120000} format="currency" />
          <StatsCard label="Net Profit" value={760000} format="currency" />
        </div>

        <SectionCard title="Sales Trend" subtitle="Online performance by month">
          <AnalyticsChart />
        </SectionCard>
      </section>
    </AdminShell>
  );
}
