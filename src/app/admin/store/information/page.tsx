import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

export default function StoreInformationPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="Store Information"
          subtitle="Update business details and branding."
        />

        <SectionCard title="Business Details">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Business name" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Tagline" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Contact phone" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Address" />
            <div className="md:col-span-2">
              <textarea className="min-h-[120px] w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Store description" />
            </div>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
