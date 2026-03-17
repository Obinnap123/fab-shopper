import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const collections = [
  { name: "New Arrivals", products: 12 },
  { name: "Best Sellers", products: 8 },
  { name: "Sale", products: 6 }
];

export default function CollectionsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Products"
          title="Collections"
          subtitle="Curate and organize product groupings."
          actions={
            <button className="rounded-full bg-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cream">
              Create Collection
            </button>
          }
        />

        <SectionCard title="Collection List">
          <div className="grid gap-4 md:grid-cols-3">
            {collections.map((collection) => (
              <div key={collection.name} className="rounded-2xl border border-forest/10 p-4">
                <p className="font-semibold text-forest">{collection.name}</p>
                <p className="mt-1 text-sm text-forest/60">{collection.products} products</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Add Collection" subtitle="Create a new collection with a hero image.">
          <div className="grid gap-4 md:grid-cols-3">
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Collection name" />
            <input className="rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Slug" />
            <button className="rounded-full border border-forest/20 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-forest">
              Upload Image
            </button>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
