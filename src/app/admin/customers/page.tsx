import { AdminShell } from "@/components/admin/layout/admin-shell";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { CustomersClient } from "@/components/admin/customers/customers-client";

export default function CustomersPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Customers"
          title="All Customers"
          subtitle="Manage your customer base and communication lists."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard label="Total Customers" value={340} />
          <StatsCard label="Customer Groups" value={6} />
          <StatsCard label="Newsletter Subscribers" value={220} />
        </div>

        <SectionCard title="Customers" subtitle="Live data from Prisma">
          <CustomersClient />
        </SectionCard>
      </section>
    </AdminShell>
  );
}
