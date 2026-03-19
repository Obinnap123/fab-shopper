import { HeroSection } from "@/components/storefront/home/hero-section";
import { CategoryShowcase } from "@/components/storefront/home/category-showcase";
import { NewArrivalsSection } from "@/components/storefront/home/new-arrivals";
import { BrandStory } from "@/components/storefront/home/brand-story";
import { NewsletterModal } from "@/components/storefront/home/newsletter-modal";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <CategoryShowcase />
      <NewArrivalsSection />
      <BrandStory />
      <NewsletterModal />
    </div>
  );
}
