import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { CustomersClient } from "@/components/admin/customers/customers-client";
import { prisma } from "@/lib/prisma";

export default async function CustomersPage() {
  const [totalCustomers, deletedCustomers, newsletterSubscribers] = await Promise.all([
    prisma.customer.count({ where: { deletedAt: null } }),
    prisma.customer.count({ where: { deletedAt: { not: null } } }),
    prisma.newsletterSubscriber.count()
  ]);
  const customerGroups = 0;

  return (
    <>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Customers"
          title="Customers"
          subtitle="Manage active customers by default and review deleted accounts when needed."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Active Customers" value={totalCustomers} />
          <StatsCard label="Deleted Customers" value={deletedCustomers} />
          <StatsCard label="Customer Groups" value={customerGroups} />
          <StatsCard label="Newsletter Subscribers" value={newsletterSubscribers} />
        </div>

        <SectionCard title="Customers" subtitle="Active customers are shown first. Use filters to inspect deleted accounts.">
          <CustomersClient />
        </SectionCard>
      </section>
    </>
  );
}
