import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const abandoned = [
  { orderNumber: "ORD-00018", customer: "Amina Idris", total: "?36,000", date: "Mar 08, 2026" },
  { orderNumber: "ORD-00017", customer: "Tomi Ojo", total: "?24,000", date: "Mar 07, 2026" }
];

export default function AbandonedOrdersPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Orders"
          title="Abandoned Orders"
          subtitle="Recover carts and follow up on incomplete checkouts."
        />

        <SectionCard title="Abandoned Carts">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.3em] text-forest/50">
                <tr>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="text-forest/70">
                {abandoned.map((order) => (
                  <tr key={order.orderNumber} className="border-t border-forest/10">
                    <td className="py-3 font-semibold text-forest">{order.orderNumber}</td>
                    <td className="py-3">{order.customer}</td>
                    <td className="py-3">{order.total}</td>
                    <td className="py-3">{order.date}</td>
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
