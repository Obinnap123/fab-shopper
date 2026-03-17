import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const transactions = [
  { ref: "PSK-9901", status: "Settled", amount: "?86,000", date: "Mar 12, 2026" },
  { ref: "MAN-2301", status: "Pending", amount: "?40,000", date: "Mar 11, 2026" }
];

export default function FinanceTransactionsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Finance"
          title="Transactions"
          subtitle="Reconcile payment activity across all channels."
        />

        <SectionCard title="Transaction Log">
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.ref} className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3">
                <div>
                  <p className="font-semibold text-forest">{tx.ref}</p>
                  <p className="text-sm text-forest/60">{tx.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-forest">{tx.amount}</p>
                  <p className="text-sm text-forest/60">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
