import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/storefront/products/product-grid";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) {
    notFound();
  }
  const collection = await prisma.collection.findUnique({
    where: { slug },
    include: { products: true }
  });

  if (!collection) {
    notFound();
  }

  const heroImage =
    collection.image ?? "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200";

  return (
    <div className="bg-[var(--brand-cream)]">
      <div className="relative h-[400px] w-full overflow-hidden">
        <Image src={heroImage} alt={collection.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-[rgba(15,36,25,0.65)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[var(--brand-gold)]">
          <h1
            className="text-[64px]"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            {collection.name}
          </h1>
          <p className="mt-3 text-sm uppercase tracking-[0.2em]">
            {collection.products.length} Items
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <ProductGrid
          products={collection.products.map((product) => ({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            discountedPrice: product.discountedPrice ? Number(product.discountedPrice) : null,
            images: product.images ?? [],
            slug: product.slug
          }))}
          theme="light"
        />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) {
    return { title: "Collection Not Found | Fab Shopper" };
  }
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) {
    return { title: "Collection Not Found | Fab Shopper" };
  }
  return {
    title: `${collection.name} | Fab Shopper`,
    description: `Shop ${collection.name} at Fab Shopper`
  };
}
