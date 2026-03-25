import Link from "next/link";
import {
  BadgeCheck,
  CalendarCheck,
  ChartNoAxesColumn,
  ClipboardList,
  Coins,
  CreditCard,
  Package,
  ShoppingBag,
  Users
} from "lucide-react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken } from "@/lib/auth";

export const dynamic = "force-dynamic"; // Ensure dashboard shows live data

const formatCurrency = (value: number) =>
  `NGN ${value.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  // Fetch real-time data from Prisma
  const [
    totalOrders,
    productsSoldAgg,
    customersCount,
    storeVisitCount,
    salesAgg,
    recentOrders,
    owedAgg
  ] = await Promise.all([
    prisma.order.count(),
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: { order: { status: "COMPLETED" } }
    }),
    prisma.customer.count(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prisma as any).storeVisit.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" }
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: true }
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: { in: ["UNPAID", "PARTIALLY_PAID"] } }
    })
  ]);

  const totalSales = Number(salesAgg._sum.total ?? 0);
  const productsSold = Number(productsSoldAgg._sum.quantity ?? 0);
  const amountOwed = Number(owedAgg._sum.total ?? 0);
  const websiteVisits = storeVisitCount;
  const greeting = getGreeting();
  
  let adminName = "Admin";
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  if (token) {
    try {
      const payload = await verifyAdminToken(token);
      if (payload?.name) adminName = payload.name;
    } catch(e) {}
  }

  return (
    <AdminShell>
      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Dashboard</p>
            <h1 className="text-2xl font-semibold text-forest">{greeting}, {adminName}</h1>
            <p className="text-sm text-forest/60">
              Share your storefront link today.
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-forest/5 px-3 py-1 text-forest/80">
                https://fabshopper.com
                <BadgeCheck className="h-4 w-4 text-gold" />
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-forest">Business Overview</h2>
                  <p className="text-sm text-forest/60">Here is how your business is doing today</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button asChild variant="outline" size="sm">
                    <a href="/reports/fab-shopper-business-report.csv" download>
                      Download Report
                    </a>
                  </Button>
                  <Select defaultValue="This Month">
                    <SelectTrigger className="h-9 w-[170px] rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-forest bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="This Month">This Month</SelectItem>
                      <SelectItem value="Last Month">Last Month</SelectItem>
                      <SelectItem value="Last 2 Months">Last 2 Months</SelectItem>
                      <SelectItem value="This Year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Orders",
                    value: totalOrders,
                    icon: ShoppingBag,
                    tone: "bg-emerald-50 text-emerald-600"
                  },
                  {
                    label: "Products Sold",
                    value: productsSold,
                    icon: Package,
                    tone: "bg-sky-50 text-sky-600"
                  },
                  {
                    label: "Customers",
                    value: customersCount,
                    icon: Users,
                    tone: "bg-amber-50 text-amber-600"
                  },
                  {
                    label: "Website Visits",
                    value: websiteVisits,
                    icon: ChartNoAxesColumn,
                    tone: "bg-rose-50 text-rose-600"
                  }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-forest/5 bg-neutral-50 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_20px_rgba(26,60,46,0.08)]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-forest/60">{stat.label}</p>
                      <span className={`rounded-xl p-2 ${stat.tone}`}>
                        <stat.icon className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-xl font-semibold text-forest">
                      {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 text-forest">
                {[
                  { label: "Total Sales", value: formatCurrency(totalSales), icon: Coins },
                  { label: "Total Settled", value: formatCurrency(totalSales), icon: CreditCard },
                  { label: "Total Owed", value: formatCurrency(amountOwed), icon: ClipboardList },
                  { label: "Offline Sales", value: formatCurrency(0), icon: CalendarCheck }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-forest/10 bg-white p-4">
                    <item.icon className="h-4 w-4 text-forest/60" />
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-forest/50 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-forest truncate" title={item.value}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-forest/10 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
                      Sales Overview
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-forest">Online vs Offline</h3>
                  </div>
                  <div className="text-xs uppercase tracking-[0.3em] text-forest/50">This Month</div>
                </div>
                <div className="mt-4 h-64">
                  <SalesChart />
                </div>
                <div className="mt-4 flex items-center gap-6 text-xs text-forest/50">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-forest" />
                    Online Sales
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                    Offline Sales
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <h3 className="text-lg font-semibold text-forest">Recent Orders</h3>
              <div className="mt-6 overflow-x-auto rounded-2xl border border-forest/10">
                <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 border-b border-forest/5 bg-neutral-50 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-forest/50">
                  <span>Order Number</span>
                  <span>Total</span>
                  <span>Status</span>
                  <span>Payment</span>
                  <span>Date</span>
                </div>
                
                {recentOrders.length === 0 ? (
                  <div className="p-10 text-center text-forest/60">
                    <Package className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p className="text-sm font-semibold text-forest">No record found</p>
                    <p className="mt-1 text-sm text-forest/60 max-w-[250px] mx-auto">
                      Record your first order to start seeing your numbers grow.
                    </p>
                    <Button asChild size="sm" className="mt-5 rounded-full border border-forest/10">
                      <Link href="/admin/orders?new=1">Record Order</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-forest/5">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {recentOrders.map((order: any) => (
                      <Link
                        key={order.id}
                        href={`/admin/orders?id=${order.id}`}
                        className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] items-center gap-4 px-6 py-4 transition hover:bg-forest/5"
                      >
                        <div>
                          <p className="text-sm font-semibold text-forest">{order.orderNumber}</p>
                          <p className="text-xs text-forest/60 mt-0.5">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-forest">
                          {formatCurrency(Number(order.total))}
                        </div>
                        <div>
                          <span className="inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-sky-600">
                            {order.status}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                              order.paymentStatus === "PAID"
                                ? "bg-green-50 text-green-600"
                                : "bg-amber-50 text-amber-600"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="text-xs text-forest/60">{formatDate(order.createdAt)}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {recentOrders.length > 0 && (
                <div className="mt-5 flex justify-end">
                  <Button asChild variant="ghost" size="sm" className="text-[11px] font-semibold uppercase tracking-wider text-forest/60 hover:text-forest">
                    <Link href="/admin/orders">View All Orders &rarr;</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-forest/10 bg-emerald-50 p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-forest">To-do List</h3>
                <button className="text-[10px] font-semibold uppercase tracking-[0.25em] text-forest/60 hover:text-forest transition">
                  View All
                </button>
              </div>
              
              {recentOrders.length === 0 ? (
                <Button asChild variant="outline" className="mt-5 w-full justify-start rounded-2xl bg-white border-forest/10 shadow-sm text-sm">
                  <Link href="/admin/orders?new=1">Record your first order</Link>
                </Button>
              ) : (
                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm transition hover:border-forest/20 hover:shadow-md cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 rounded-full bg-amber-50 p-2 text-amber-600">
                        <Package className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-forest">Fulfill Orders</p>
                        <p className="text-xs text-forest/60 mt-1 line-clamp-2">You might have unprocessed orders waiting to be shipped.</p>
                      </div>
                    </div>
                    <Button asChild size="sm" variant="outline" className="mt-4 w-full rounded-xl border-forest/10 text-xs">
                      <Link href="/admin/orders">Check Orders</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <h3 className="text-base font-semibold text-forest">Quick Actions</h3>
              <div className="mt-4 space-y-2.5 text-sm font-medium text-forest/80">
                {[
                  { label: "Create New Order", icon: CalendarCheck, href: "/admin/orders?new=1" },
                  { label: "Add A New Product", icon: Package, href: "/admin/products?new=1" },
                  { label: "View All Customers", icon: Users, href: "/admin/customers" }
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3.5 rounded-2xl border border-transparent px-4 py-3 transition hover:bg-forest/5 hover:border-forest/10 hover:text-forest"
                  >
                    <action.icon className="h-4 w-4 text-forest/50" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
