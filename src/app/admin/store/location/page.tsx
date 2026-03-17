import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const locations = [
  { name: "Headquarters", address: "7B Nduka Osadebay Ajao Estate, Lagos" },
  { name: "Pop-up Studio", address: "Victoria Island, Lagos" }
];

export default function StoreLocationPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Operations"
          title="Store Locations"
          subtitle="Manage fulfillment and pickup locations."
        />

        <SectionCard title="Locations">
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location.name} className="rounded-2xl border border-forest/10 p-4">
                <p className="font-semibold text-forest">{location.name}</p>
                <p className="mt-1 text-sm text-forest/60">{location.address}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Add Location">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Location name" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Address" />
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
