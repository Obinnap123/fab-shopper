"use client";

import { useState } from "react";
import { BadgeCheck, CreditCard, ShieldAlert } from "lucide-react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";

const tabs = ["online", "manual", "pos"] as const;

const onlineMethods = [
  { name: "Paystack", fee: "1.2%", status: "Connected" },
  { name: "Nomba", fee: "1.2%", status: "Not connected" },
  { name: "PocketApp", fee: "0.7%", status: "Not connected" },
  { name: "Fincra", fee: "1.4%", status: "Not connected" },
  { name: "Bumpa Terminal", fee: "1.0%", status: "Not connected" },
  { name: "Merchant's Account", fee: "Manual", status: "Not connected" }
];

export default function PaymentMethodsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("online");
  const [chargeMode, setChargeMode] = useState<"myself" | "customer">("myself");

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Finance"
          title="Payment Methods"
          subtitle="Connect online and offline payment providers."
        />

        <SectionCard title="Transaction Charges" subtitle="Choose who bears transaction fees.">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant={chargeMode === "myself" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setChargeMode("myself")}
            >
              Myself
            </Button>
            <Button
              type="button"
              variant={chargeMode === "customer" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setChargeMode("customer")}
            >
              Customer
            </Button>
            <div className="flex items-center gap-2 text-sm text-forest/60">
              <ShieldAlert className="h-4 w-4" />
              7.5% VAT applies to payment method fees.
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-wrap items-center gap-4 border-b border-forest/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold uppercase tracking-[0.2em] ${
                activeTab === tab
                  ? "border-b-2 border-forest text-forest"
                  : "text-forest/50 hover:text-forest"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "online" ? (
          <SectionCard title="Online Payments" subtitle="Connect payment processors for checkout.">
            <div className="grid gap-4 md:grid-cols-3">
              {onlineMethods.map((method) => (
                <div key={method.name} className="rounded-2xl border border-forest/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-forest">{method.name}</p>
                    {method.status === "Connected" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-600">
                        <BadgeCheck className="h-3.5 w-3.5" /> Connected
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-forest/60">Fee: {method.fee}</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full rounded-full"
                  >
                    {method.status === "Connected" ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              ))}
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "manual" ? (
          <SectionCard title="Manual Payment Methods" subtitle="Track bank transfers and offline payments.">
            <div className="rounded-2xl border border-forest/10 p-6 text-sm text-forest/60">
              Manual methods allow you to record offline payments like bank transfer or POS.
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "pos" ? (
          <SectionCard title="POS" subtitle="Point of sale devices and terminals.">
            <div className="rounded-2xl border border-forest/10 p-6 text-sm text-forest/60">
              Connect POS devices to track in-store sales.
            </div>
          </SectionCard>
        ) : null}

        <SectionCard title="Paystack Webhook" subtitle="Verify payment events">
          <div className="flex flex-wrap items-center gap-3 text-sm text-forest/60">
            <CreditCard className="h-5 w-5 text-forest" />
            Webhook endpoint: <span className="font-semibold text-forest">/api/webhooks/paystack</span>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
