import { FeaturedCollections } from "@/components/storefront/home/featured-collections";
import { HeroSection } from "@/components/storefront/home/hero-section";
import { NewArrivalsSection } from "@/components/storefront/home/new-arrivals";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCollections />
      <NewArrivalsSection />
    </div>
  );
}
