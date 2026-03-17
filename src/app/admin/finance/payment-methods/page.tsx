import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const methods = [
  { name: "Paystack", fee: "1.2%", status: "Connected" },
  { name: "Nomba", fee: "1.2%", status: "Not connected" },
  { name: "PocketApp", fee: "0.7%", status: "Not connected" }
];

export default function PaymentMethodsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Finance"
          title="Payment Methods"
          subtitle="Connect online and offline payment providers."
        />

        <SectionCard title="Online Payments">
          <div className="grid gap-4 md:grid-cols-3">
            {methods.map((method) => (
              <div key={method.name} className="rounded-2xl border border-forest/10 p-4">
                <p className="font-semibold text-forest">{method.name}</p>
                <p className="mt-1 text-sm text-forest/60">Fee: {method.fee}</p>
                <button className="mt-4 rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest">
                  {method.status === "Connected" ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
