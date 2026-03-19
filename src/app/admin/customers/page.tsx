import { AdminShell } from "@/components/admin/layout/admin-shell";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { CustomersClient } from "@/components/admin/customers/customers-client";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const [totalCustomers, newsletterSubscribers] = await Promise.all([
    prisma.customer.count(),
    prisma.newsletterSubscriber.count()
  ]);
  const customerGroups = 0;

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Customers"
          title="All Customers"
          subtitle="Manage your customer base and communication lists."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard label="Total Customers" value={totalCustomers} />
          <StatsCard label="Customer Groups" value={customerGroups} />
          <StatsCard label="Newsletter Subscribers" value={newsletterSubscribers} />
        </div>

        <SectionCard title="Customers" subtitle="Live data from Prisma">
          <CustomersClient />
        </SectionCard>
      </section>
    </AdminShell>
  );
}
