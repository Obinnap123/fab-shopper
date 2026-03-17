import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const transactions = [
  { ref: "PSK-9901", channel: "Paystack", amount: "?86,000", date: "Mar 12, 2026" },
  { ref: "PSK-9900", channel: "Paystack", amount: "?52,500", date: "Mar 10, 2026" }
];

export default function AnalyticsTransactionsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Analytics"
          title="Transactions"
          subtitle="Review all online and offline transactions."
        />

        <SectionCard title="Transaction History">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.3em] text-forest/50">
                <tr>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Channel</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="text-forest/70">
                {transactions.map((tx) => (
                  <tr key={tx.ref} className="border-t border-forest/10">
                    <td className="py-3 font-semibold text-forest">{tx.ref}</td>
                    <td className="py-3">{tx.channel}</td>
                    <td className="py-3">{tx.amount}</td>
                    <td className="py-3">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
