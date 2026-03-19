import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/storefront/products/product-detail";
import type { Metadata } from "next";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  });

  if (!product) {
    return {
      title: "Product Not Found | Fab Shopper"
    };
  }

  return {
    title: `${product.name} | Fab Shopper`,
    description: product.shortDescription ?? undefined,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? undefined,
      images: product.images?.[0] ? [product.images[0]] : []
    }
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { variants: true }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[var(--brand-cream)] px-6 py-16">
      <div className="mx-auto w-full max-w-6xl">
        <ProductDetail
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price),
            discountedPrice: product.discountedPrice ? Number(product.discountedPrice) : null,
            images: product.images ?? [],
            stockQuantity: product.stockQuantity,
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
            variants: product.variants
          }}
        />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.images,
            offers: {
              "@type": "Offer",
              price: Number(product.price),
              priceCurrency: "NGN",
              availability:
                product.stockQuantity > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
    </div>
  );
}
