import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CreateProductPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Products"
          title="Create Product"
          subtitle="Add a new product or variation-rich item to the Fab Shopper store."
          actions={
            <>
              <button className="rounded-full border border-forest/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest">
                Preview
              </button>
              <button className="rounded-full bg-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cream">
                Add Product
              </button>
            </>
          }
        />

        <SectionCard title="Product Type" subtitle="Choose if this product has variations.">
          <div className="grid gap-4 md:grid-cols-2">
            <button className="rounded-2xl border border-forest/20 p-5 text-left shadow-sm">
              <p className="font-semibold text-forest">Regular Product</p>
              <p className="mt-2 text-sm text-forest/60">Single SKU, no variations.</p>
            </button>
            <button className="rounded-2xl border border-forest/20 p-5 text-left shadow-sm">
              <p className="font-semibold text-forest">Product with Variations</p>
              <p className="mt-2 text-sm text-forest/60">Sizes, colors, materials, and more.</p>
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Product Details" subtitle="Core product information and media.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Product Name</label>
              <input className="w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="Palm Silk Set" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Store Location</label>
              <Select defaultValue="Headquarters (Lagos)">
                <SelectTrigger className="h-11 rounded-2xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Headquarters (Lagos)">Headquarters (Lagos)</SelectItem>
                  <SelectItem value="Pop-up">Pop-up</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Short Description</label>
              <textarea className="min-h-[120px] w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Product Images</label>
              <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-forest/30 text-sm text-forest/50">
                Drag & drop product images here
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Pricing & Inventory" subtitle="Set pricing and stock levels.">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Price</label>
              <input className="w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="?0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Cost Price</label>
              <input className="w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="?0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Discounted Price</label>
              <input className="w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="?0" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Stock Quantity</label>
              <input className="w-full rounded-2xl border border-forest/15 px-4 py-3 text-sm" placeholder="0" />
            </div>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
