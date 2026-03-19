import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";

const apps = [
  { name: "Facebook Pixel", description: "Track conversions on Meta.", status: "Not connected" },
  { name: "Google Analytics", description: "Website analytics and traffic.", status: "Connected" },
  { name: "Shipbubble", description: "Courier and shipping automation.", status: "Not connected" },
  { name: "Chowdeck", description: "Delivery integrations.", status: "Not connected" }
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
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-forest">{app.name}</p>
                  {app.status === "Connected" ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-600">
                      Connected
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-forest/60">{app.description}</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-full"
                >
                  {app.status === "Connected" ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
