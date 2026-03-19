"use client";

import { useState } from "react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const expenses = [
  { category: "Studio Rent", amount: "₦180,000", date: "Mar 01, 2026" },
  { category: "Packaging", amount: "₦45,000", date: "Mar 05, 2026" }
];

const categories = ["Logistics", "Marketing", "Inventory", "Utilities"];

export default function ExpensesPage() {
  const [tab, setTab] = useState<"expenses" | "category">("expenses");

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Finance"
          title="Expenses"
          subtitle="Track operational costs and uploads."
          actions={<Button className="rounded-full bg-forest text-cream">Add Expense</Button>}
        />

        <div className="flex flex-wrap items-center gap-4 border-b border-forest/10">
          {[
            { key: "expenses", label: "Expenses" },
            { key: "category", label: "Expense Category" }
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key as typeof tab)}
              className={`pb-3 text-sm font-semibold uppercase tracking-[0.2em] ${
                tab === item.key
                  ? "border-b-2 border-forest text-forest"
                  : "text-forest/50 hover:text-forest"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "expenses" ? (
          <>
            <SectionCard title="Expense Log">
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.category}
                    className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-forest">{expense.category}</p>
                      <p className="text-sm text-forest/60">{expense.date}</p>
                    </div>
                    <p className="font-semibold text-forest">{expense.amount}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Create Expense" subtitle="Log a new operational cost.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input placeholder="Marketing" />
                </div>
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input placeholder="50000" />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input placeholder="Instagram ads" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Receipt Upload</Label>
                  <Input type="file" />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button className="rounded-full bg-forest text-cream">Save Expense</Button>
              </div>
            </SectionCard>
          </>
        ) : (
          <SectionCard title="Expense Categories" subtitle="Common expense buckets">
            <div className="grid gap-3 md:grid-cols-2">
              {categories.map((category) => (
                <div key={category} className="rounded-2xl border border-forest/10 p-4 text-sm text-forest/70">
                  {category}
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </section>
    </AdminShell>
  );
}
