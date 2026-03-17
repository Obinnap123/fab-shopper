import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

export default function BankDetailsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Finance"
          title="Bank Details"
          subtitle="Set up payout accounts for settlements."
        />

        <SectionCard title="Business Bank Account">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Bank name" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Account number" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Account name" />
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
