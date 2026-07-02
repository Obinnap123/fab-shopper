import { HeroSection } from "@/components/storefront/home/hero-section";
import { CategoryShowcase } from "@/components/storefront/home/category-showcase";
import { NewArrivalsSection } from "@/components/storefront/home/new-arrivals";
import { BrandStory } from "@/components/storefront/home/brand-story";
import { NewsletterModal } from "@/components/storefront/home/newsletter-modal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    select: {
      name: true,
      slug: true,
      image: true,
      products: {
        where: { status: "PUBLISHED", deletedAt: null },
        select: { id: true }
      }
    }
  });

  const storefrontCollections = collections.map(({ products, ...collection }) => ({
    ...collection,
    publishedProductCount: products.length
  }));

  return (
    <div>
      <HeroSection />
      <CategoryShowcase collections={storefrontCollections} />
      <NewArrivalsSection />
      <BrandStory />
      <NewsletterModal />
    </div>
  );
}
