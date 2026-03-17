import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const expenses = [
  { category: "Studio Rent", amount: "?180,000", date: "Mar 01, 2026" },
  { category: "Packaging", amount: "?45,000", date: "Mar 05, 2026" }
];

export default function ExpensesPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Finance"
          title="Expenses"
          subtitle="Track operational costs and uploads."
          actions={
            <button className="rounded-full bg-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cream">
              Add Expense
            </button>
          }
        />

        <SectionCard title="Expense Log">
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.category} className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3">
                <div>
                  <p className="font-semibold text-forest">{expense.category}</p>
                  <p className="text-sm text-forest/60">{expense.date}</p>
                </div>
                <p className="font-semibold text-forest">{expense.amount}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
