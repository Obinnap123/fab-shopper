import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { prisma } from "@/lib/prisma";
import { CollectionsClient } from "./collections-client";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Products"
          title="Collections"
          subtitle="Curate and visually organize product groupings."
        />

        <CollectionsClient initialCollections={collections} />
        
      </section>
    </AdminShell>
  );
}
