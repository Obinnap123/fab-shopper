import { Suspense } from "react";
import { BadgeDollarSign, CheckCircle2, ClipboardCheck, CreditCard, PackageCheck } from "lucide-react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { OrdersClient } from "@/components/admin/orders/orders-client";
import { OrdersHeaderActions } from "@/components/admin/orders/orders-header-actions";
import { prisma } from "@/lib/prisma";

const formatCurrency = (value: number) =>
  `?${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

export default async function OrdersPage() {
  const [totalOrders, completedOrders, unpaidOrders, paidOrders, owedAgg] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.order.count({ where: { paymentStatus: "UNPAID" } }),
    prisma.order.count({ where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: { in: ["UNPAID", "PARTIALLY_PAID"] } }
    })
  ]);

  const amountOwed = Number(owedAgg._sum.total ?? 0);

  return (
    <AdminShell>
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-forest">Orders</h1>
          <OrdersHeaderActions />
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          {[
            {
              label: "Total Orders",
              value: totalOrders.toString(),
              icon: PackageCheck,
              tone: "bg-emerald-50 text-emerald-600"
            },
            {
              label: "Amount Owed",
              value: formatCurrency(amountOwed),
              icon: BadgeDollarSign,
              tone: "bg-rose-50 text-rose-600"
            },
            {
              label: "Paid Orders",
              value: paidOrders.toString(),
              icon: CheckCircle2,
              tone: "bg-green-50 text-green-600"
            },
            {
              label: "Completed Orders",
              value: completedOrders.toString(),
              icon: ClipboardCheck,
              tone: "bg-sky-50 text-sky-600"
            },
            {
              label: "Unpaid Orders",
              value: unpaidOrders.toString(),
              icon: CreditCard,
              tone: "bg-amber-50 text-amber-600"
            }
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60 mb-3">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-forest">{stat.value}</p>
                </div>
                <span className={`rounded-2xl p-3 ${stat.tone} flex-shrink-0`}>
                  <stat.icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <Suspense fallback={<div className="py-6 text-sm text-forest/60">Loading orders…</div>}>
          <OrdersClient />
        </Suspense>
      </section>
    </AdminShell>
  );
}
