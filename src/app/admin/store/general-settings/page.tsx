import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

export default function GeneralSettingsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="General Settings"
          subtitle="Inventory, product, and order preferences."
        />

        <SectionCard title="Inventory Settings">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 text-sm text-forest/70">
              <input type="checkbox" className="h-4 w-4" /> Reserve inventory in cart
            </label>
            <label className="flex items-center gap-3 text-sm text-forest/70">
              <input type="checkbox" className="h-4 w-4" defaultChecked /> Show out of stock items
            </label>
            <label className="flex items-center gap-3 text-sm text-forest/70">
              <input type="checkbox" className="h-4 w-4" defaultChecked /> Show stock count
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Low Stock Alert">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Alert threshold" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Reserve minutes" />
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
