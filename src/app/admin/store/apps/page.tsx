import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const apps = [
  { name: "Facebook Pixel", description: "Track conversions on Meta." },
  { name: "Google Analytics", description: "Website analytics and traffic." },
  { name: "Shipbubble", description: "Courier and shipping automation." },
  { name: "Chowdeck", description: "Delivery integrations." }
];

export default function StoreAppsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="Connected Apps"
          subtitle="Manage integrations across marketing and operations."
        />

        <SectionCard title="Available Apps">
          <div className="grid gap-4 md:grid-cols-2">
            {apps.map((app) => (
              <div key={app.name} className="rounded-2xl border border-forest/10 p-4">
                <p className="font-semibold text-forest">{app.name}</p>
                <p className="mt-1 text-sm text-forest/60">{app.description}</p>
                <button className="mt-4 rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
