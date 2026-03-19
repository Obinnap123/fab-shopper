"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, FileText, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsLineChart } from "@/components/admin/analytics/analytics-line-chart";
import { SectionCard } from "@/components/admin/ui/section-card";

type SeriesPoint = { month: string; value: number };

type TransactionRow = {
  id: string;
  reference: string;
  channel: string;
  amount: number;
  date: string;
  status: string;
};

type ProductSummary = {
  name: string;
  units: number;
  revenue: number;
};

type AnalyticsDashboardProps = {
  salesSeries: SeriesPoint[];
  shippingSeries: SeriesPoint[];
  totalSales: number;
  shippingSpend: number;
  grossProfit: number | null;
  netProfit: number | null;
  expenses: number;
  missingCostPrices: number;
  onlineTransactions: number;
  offlineTransactions: number;
  recentTransactions: TransactionRow[];
  topProducts: ProductSummary[];
  topRevenueProducts: ProductSummary[];
  newCustomers: number;
  repeatCustomers: number;
  avgLtv: number;
};

const formatCurrency = (value: number) =>
  `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;

export function AnalyticsDashboard({
  salesSeries,
  shippingSeries,
  totalSales,
  shippingSpend,
  grossProfit,
  netProfit,
  expenses,
  missingCostPrices,
  onlineTransactions,
  offlineTransactions,
  recentTransactions,
  topProducts,
  topRevenueProducts,
  newCustomers,
  repeatCustomers,
  avgLtv
}: AnalyticsDashboardProps) {
  const [tab, setTab] = useState<"sales" | "transactions" | "products" | "customers">("sales");
  const [range, setRange] = useState<"last-12" | "last-6" | "last-3">("last-12");

  const chartData = useMemo(() => {
    if (range === "last-6") return salesSeries.slice(-6);
    if (range === "last-3") return salesSeries.slice(-3);
    return salesSeries;
  }, [range, salesSeries]);

  const shippingData = useMemo(() => {
    if (range === "last-6") return shippingSeries.slice(-6);
    if (range === "last-3") return shippingSeries.slice(-3);
    return shippingSeries;
  }, [range, shippingSeries]);

  const rangeLabel = useMemo(() => {
    if (range === "last-3") return "Last 3 Months";
    if (range === "last-6") return "Last 6 Months";
    return "Last 12 Months";
  }, [range]);

  const handleDownload = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Sales", formatCurrency(totalSales)],
      ["Shipping Spend", formatCurrency(shippingSpend)],
      ["Gross Profit", grossProfit === null ? "N/A" : formatCurrency(grossProfit)],
      ["Net Profit", netProfit === null ? "N/A" : formatCurrency(netProfit)],
      ["Expenses", formatCurrency(expenses)],
      ["Online Transactions", onlineTransactions.toString()],
      ["Offline Transactions", offlineTransactions.toString()]
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "fab-shopper-analytics.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
            Analytics
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-forest">Analytics</h1>
          <p className="mt-2 text-sm text-forest/60">
            Track performance and compare periods.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-forest/15 bg-forest/5 px-4 py-2 text-xs text-forest/60">
            <FileText className="h-4 w-4 text-forest" />
            Business report is ready.
            <Button
              type="button"
              size="sm"
              className="h-7 rounded-full bg-forest text-xs text-white"
              onClick={handleDownload}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-forest/60">
            Select date to filter:
            <Select value={range} onValueChange={(value) => setRange(value as typeof range)}>
              <SelectTrigger className="h-9 rounded-full border border-forest/20 bg-white px-4 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-12">Last 12 Months</SelectItem>
                <SelectItem value="last-6">Last 6 Months</SelectItem>
                <SelectItem value="last-3">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select defaultValue="compare">
            <SelectTrigger className="h-9 rounded-full border border-forest/20 bg-white px-4 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compare">Compare</SelectItem>
              <SelectItem value="previous">Previous period</SelectItem>
              <SelectItem value="year">Same period last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-forest/10">
        {[
          { key: "sales", label: "Sales" },
          { key: "transactions", label: "Transactions" },
          { key: "products", label: "Products" },
          { key: "customers", label: "Customers" }
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key as typeof tab)}
            className={`pb-3 text-sm font-semibold ${
              tab === item.key
                ? "border-b-2 border-forest text-forest"
                : "text-forest/50 hover:text-forest"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "sales" ? (
        <div className="space-y-6">
          {missingCostPrices > 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Gross and net profit are hidden because {missingCostPrices} products are missing
                cost price. Add cost price to unlock full profit analytics.
              </div>
              <Button asChild size="sm" className="rounded-full bg-forest text-white">
                <Link href="/admin/products">View Products</Link>
              </Button>
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard
              title="Total Sales"
              subtitle={`${rangeLabel}`}
              actions={<span className="text-sm font-semibold text-forest">{formatCurrency(totalSales)}</span>}
            >
              <AnalyticsLineChart data={chartData} color="#1a3c2e" />
            </SectionCard>
            <SectionCard
              title="Shipping Spend"
              subtitle={`${rangeLabel}`}
              actions={
                <span className="text-sm font-semibold text-forest">
                  {formatCurrency(shippingSpend)}
                </span>
              }
            >
              <AnalyticsLineChart data={shippingData} color="#c9a84c" />
            </SectionCard>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
                Gross Profit
              </p>
              <p className="mt-4 text-2xl font-semibold text-forest">
                {grossProfit === null ? "—" : formatCurrency(grossProfit)}
              </p>
            </div>
            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
                Net Profit
              </p>
              <p className="mt-4 text-2xl font-semibold text-forest">
                {netProfit === null ? "—" : formatCurrency(netProfit)}
              </p>
            </div>
            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
                Expenses
              </p>
              <p className="mt-4 text-2xl font-semibold text-forest">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </div>
      ) : null}

      {tab === "transactions" ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
                Online Transactions
              </p>
              <p className="mt-4 text-2xl font-semibold text-forest">{onlineTransactions}</p>
            </div>
            <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
                Offline Transactions
              </p>
              <p className="mt-4 text-2xl font-semibold text-forest">{offlineTransactions}</p>
            </div>
          </div>

          <SectionCard title="Transaction History" subtitle="Most recent payments and manual entries">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.3em] text-forest/50">
                  <tr>
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Channel</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-forest/70">
                  {recentTransactions.length ? (
                    recentTransactions.map((tx) => (
                      <tr key={tx.id} className="border-t border-forest/10">
                        <td className="py-3 font-semibold text-forest">{tx.reference}</td>
                        <td className="py-3">{tx.channel}</td>
                        <td className="py-3">{formatCurrency(tx.amount)}</td>
                        <td className="py-3">{tx.status}</td>
                        <td className="py-3">{tx.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-6 text-sm text-forest/50" colSpan={5}>
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      ) : null}

      {tab === "products" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Best Selling Products" subtitle="Highest units sold">
            <div className="space-y-3">
              {topProducts.length ? (
                topProducts.map((product) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-forest">{product.name}</p>
                      <p className="text-sm text-forest/60">{product.units} units</p>
                    </div>
                    <p className="text-sm font-semibold text-forest">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-forest/50">No product sales yet.</p>
              )}
            </div>
          </SectionCard>
          <SectionCard title="Top Revenue Products" subtitle="Highest revenue earned">
            <div className="space-y-3">
              {topRevenueProducts.length ? (
                topRevenueProducts.map((product) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-forest">{product.name}</p>
                      <p className="text-sm text-forest/60">{product.units} units</p>
                    </div>
                    <p className="text-sm font-semibold text-forest">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-forest/50">No revenue data yet.</p>
              )}
            </div>
          </SectionCard>
        </div>
      ) : null}

      {tab === "customers" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
              New Customers
            </p>
            <p className="mt-4 text-2xl font-semibold text-forest">{newCustomers}</p>
          </div>
          <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
              Repeat Customers
            </p>
            <p className="mt-4 text-2xl font-semibold text-forest">{repeatCustomers}</p>
          </div>
          <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">
              Avg. Customer LTV
            </p>
            <p className="mt-4 text-2xl font-semibold text-forest">{formatCurrency(avgLtv)}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
