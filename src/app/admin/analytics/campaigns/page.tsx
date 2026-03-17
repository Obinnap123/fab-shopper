import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

export default function AnalyticsCampaignsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Analytics"
          title="Campaign Performance"
          subtitle="Track sales impact across discount and email campaigns."
        />

        <SectionCard title="Campaign Snapshot">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-forest/10 p-4">
              <p className="text-sm text-forest/60">Active Campaigns</p>
              <p className="mt-2 text-xl font-semibold text-forest">3</p>
            </div>
            <div className="rounded-2xl border border-forest/10 p-4">
              <p className="text-sm text-forest/60">Attributed Revenue</p>
              <p className="mt-2 text-xl font-semibold text-forest">?420,000</p>
            </div>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
