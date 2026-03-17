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

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Dashboard</p>
            <h1 className="text-2xl font-semibold text-forest">Hello Zikora</h1>
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
                    <SelectTrigger className="h-9 w-[170px] rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
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

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  {
                    label: "Orders",
                    value: "0",
                    icon: ShoppingBag,
                    tone: "bg-emerald-50 text-emerald-600"
                  },
                  {
                    label: "Products Sold",
                    value: "0",
                    icon: Package,
                    tone: "bg-sky-50 text-sky-600"
                  },
                  {
                    label: "New Customers",
                    value: "0",
                    icon: Users,
                    tone: "bg-amber-50 text-amber-600"
                  },
                  {
                    label: "Website Visits",
                    value: "12",
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
                    <p className="mt-3 text-xl font-semibold text-forest">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  { label: "Total Sales", icon: Coins },
                  { label: "Total Settled", icon: CreditCard },
                  { label: "Total Owed", icon: ClipboardList },
                  { label: "Offline Sales", icon: CalendarCheck }
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-forest/10 bg-white p-4">
                    <item.icon className="h-4 w-4 text-forest/60" />
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-forest/50">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-forest">
                      {"\u20A6"}0.00
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
              <div className="mt-6 overflow-hidden rounded-2xl border border-forest/10">
                <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-4 bg-neutral-50 px-6 py-3 text-xs uppercase tracking-[0.25em] text-forest/50">
                  <span>Order Number & Name</span>
                  <span>Total</span>
                  <span>Status</span>
                  <span>Payment</span>
                  <span>Date</span>
                </div>
                <div className="p-8 text-center">
                  <p className="text-sm font-semibold text-forest">No record found</p>
                  <p className="mt-2 text-sm text-forest/60">
                    Record your first order to start seeing your numbers grow.
                  </p>
                  <Button asChild size="sm" className="mt-4">
                    <Link href="/admin/orders?new=1">Record Order</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-forest/10 bg-emerald-50 p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-forest">To-do List</h3>
                <button className="text-xs font-semibold uppercase tracking-[0.25em] text-forest/60">
                  View All
                </button>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full justify-start">
                <Link href="/admin/orders?new=1">Record your first order</Link>
              </Button>
            </div>

            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <h3 className="text-base font-semibold text-forest">Quick Actions</h3>
              <div className="mt-4 space-y-3 text-sm text-forest/70">
                {[
                  { label: "Create New Order", icon: CalendarCheck, href: "/admin/orders?new=1" },
                  { label: "Add A New Product", icon: Package, href: "/admin/products?new=1" }
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 rounded-2xl border border-forest/10 px-4 py-3 transition hover:bg-forest/5"
                  >
                    <action.icon className="h-4 w-4 text-forest/60" />
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
