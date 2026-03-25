import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { prisma } from "@/lib/prisma";
import { Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FinanceTransactionsPage() {
  const latestOrders = await prisma.order.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true, paymentStatus: true, total: true, createdAt: true }
  });

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
            {latestOrders.length === 0 ? (
               <div className="py-12 text-center text-forest/60">
                 <Package className="mx-auto h-8 w-8 opacity-20 mb-3" />
                 <p className="text-sm">No transactions found</p>
               </div>
            ) : (
              latestOrders.map((tx) => (
                <div key={tx.orderNumber} className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3">
                  <div>
                    <p className="font-semibold text-forest">{tx.orderNumber}</p>
                    <p className="text-sm text-forest/60">{tx.paymentStatus}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-forest">
                      NGN {Number(tx.total).toLocaleString()}
                    </p>
                    <p className="text-sm text-forest/60">
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(tx.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
