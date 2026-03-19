"use client";

import { useState } from "react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Input } from "@/components/ui/input";

const tabs = [
  "Inventory",
  "Products",
  "Orders",
  "Shipping",
  "Campaigns",
  "Notifications"
];

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState("Inventory");

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="General Settings"
          subtitle="Inventory, product, and order preferences."
        />

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

        {activeTab === "Inventory" ? (
          <SectionCard title="Inventory Settings" subtitle="Manage stock visibility and alerts.">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 text-sm text-forest/70">
                <input type="checkbox" className="h-4 w-4" /> Reserve inventory in cart
              </label>
              <label className="flex items-center gap-3 text-sm text-forest/70">
                <input type="checkbox" className="h-4 w-4" defaultChecked /> Show out of stock items
              </label>
              <label className="flex items-center gap-3 text-sm text-forest/70">
                <input type="checkbox" className="h-4 w-4" defaultChecked /> Show stock count
              </label>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-forest">Low Stock Alert</label>
                <Input placeholder="3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-forest">Reserve Minutes</label>
                <Input placeholder="15" />
              </div>
            </div>
          </SectionCard>
        ) : (
          <SectionCard title={`${activeTab} Settings`} subtitle="Coming soon">
            <div className="rounded-2xl border border-forest/10 bg-forest/5 p-6 text-sm text-forest/60">
              Settings for {activeTab.toLowerCase()} will be available soon.
            </div>
          </SectionCard>
        )}
      </section>
    </AdminShell>
  );
}
