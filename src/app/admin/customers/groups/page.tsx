import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const groups = [
  { name: "VIP Clients", members: 24 },
  { name: "Wholesale Buyers", members: 12 },
  { name: "First-time Customers", members: 90 }
];

export default function CustomerGroupsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Customers"
          title="Customer Groups"
          subtitle="Segment customers for targeted campaigns."
        />

        <SectionCard title="Groups">
          <div className="grid gap-4 md:grid-cols-3">
            {groups.map((group) => (
              <div key={group.name} className="rounded-2xl border border-forest/10 p-4">
                <p className="font-semibold text-forest">{group.name}</p>
                <p className="mt-1 text-sm text-forest/60">{group.members} members</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
