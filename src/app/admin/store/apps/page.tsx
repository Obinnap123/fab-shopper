import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { AppsClientList } from "@/app/admin/store/apps/apps-client-list";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StoreAppsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = await (prisma as any).storeSettings.findFirst();
  const snapPixelId = (settings as any)?.snapPixelId;

  const apps = [
    { id: "snap", name: "Snapchat Pixel", description: "Optimize ads and build audiences.", isConnected: !!snapPixelId },
    { id: "fb", name: "Facebook Pixel", description: "Track conversions on Meta.", isConnected: false },
    { id: "ga", name: "Google Analytics", description: "Website analytics and traffic.", isConnected: true },
    { id: "ship", name: "Shipbubble", description: "Courier and shipping automation.", isConnected: false },
    { id: "chow", name: "Chowdeck", description: "Delivery integrations.", isConnected: false }
  ];

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="Connected Apps"
          subtitle="Manage integrations across marketing and operations."
        />

        <SectionCard title="Available Apps">
          <AppsClientList apps={apps} />
        </SectionCard>
      </section>
    </AdminShell>
  );
}
