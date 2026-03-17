import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const zones = [
  { name: "Standard (Within Lagos)", fee: "?4,500" },
  { name: "South West", fee: "?6,500" },
  { name: "South", fee: "?7,500" }
];

export default function ShippingPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Operations"
          title="Shipping Methods"
          subtitle="Maintain delivery zones and pickup options."
          actions={
            <button className="rounded-full bg-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cream">
              Add Method
            </button>
          }
        />

        <SectionCard title="Active Shipping Zones">
          <div className="grid gap-4 md:grid-cols-3">
            {zones.map((zone) => (
              <div key={zone.name} className="rounded-2xl border border-forest/10 p-4">
                <p className="font-semibold text-forest">{zone.name}</p>
                <p className="mt-1 text-sm text-forest/60">{zone.fee}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
