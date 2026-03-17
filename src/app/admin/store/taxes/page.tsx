import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const taxes = [{ name: "VAT", percentage: "7.5%", description: "Value Added Tax" }];

export default function TaxesPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="Taxes"
          subtitle="Manage tax rates applied at checkout."
        />

        <SectionCard title="Tax Rates">
          <div className="space-y-3">
            {taxes.map((tax) => (
              <div key={tax.name} className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3">
                <div>
                  <p className="font-semibold text-forest">{tax.name}</p>
                  <p className="text-sm text-forest/60">{tax.description}</p>
                </div>
                <p className="font-semibold text-forest">{tax.percentage}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Add Tax">
          <div className="grid gap-4 md:grid-cols-3">
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Tax name" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Percentage" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Description" />
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
