import { AdminShell } from "@/components/admin/layout/admin-shell";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { OrdersClient } from "@/components/admin/orders/orders-client";

export default function OrdersPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Orders"
          title="All Orders"
          subtitle="Track, fulfill, and manage customer orders."
        />

        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard label="Total Orders" value={328} />
          <StatsCard label="Amount Owed" value={560000} format="currency" />
          <StatsCard label="Completed Orders" value={214} />
          <StatsCard label="Unpaid Orders" value={32} />
        </div>

        <SectionCard title="Order List" subtitle="Live data from Prisma">
          <OrdersClient />
        </SectionCard>
      </section>
    </AdminShell>
  );
}
