import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-[var(--brand-cream)] min-h-screen text-[var(--brand-green)]">
      <PageSpacer />
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center py-24 md:py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="z-10 max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--brand-gold)] mb-4">
            Delight Closet Revolution
          </p>
          <h1 className="text-5xl md:text-7xl mb-6 font-display italic leading-[1.1]">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-[var(--brand-green)]/70 leading-relaxed font-light max-w-2xl mx-auto">
            Fab Shopper is a premium fashion destination born in Lagos, Nigeria. We believe in elevating everyday style with pieces that speak volumes without saying a word.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-white border-y border-[rgba(26,60,46,0.05)]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden bg-[var(--brand-green)]/5">
            <div className="absolute inset-0 flex items-center justify-center text-[var(--brand-green)]/20 font-display italic text-4xl">
              FAB
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-display italic text-[var(--brand-green)]">
              Crafting Excellence
            </h2>
            <p className="text-[var(--brand-green)]/70 leading-relaxed">
              What started as a passion for unique fashion items quickly grew into a full-scale closet revolution. At Fab Shopper, our mission is simple: to curate and deliver the finest statement pieces that make our clients stand out effortlessly.
            </p>
            <p className="text-[var(--brand-green)]/70 leading-relaxed">
              From our flagship store at Justice Mall in Lekki to wardrobes across the nation, we source only the best designer shoes, bags, perfumes, and apparel. Every item is a testament to our commitment to luxury and impeccable taste.
            </p>
            <div className="pt-6">
              <Link href="/shop" className="inline-flex items-center gap-2 border-b border-[var(--brand-gold)] pb-1 text-sm uppercase tracking-[0.2em] font-semibold text-[var(--brand-gold)] hover:text-[var(--brand-green)] hover:border-[var(--brand-green)] transition-colors">
                Explore The Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 text-center max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display italic text-[var(--brand-green)] mb-16">
          Why Choose Us
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center text-[var(--brand-gold)] text-2xl font-display italic">1</div>
            <h3 className="text-xl font-semibold">Premium Quality</h3>
            <p className="text-[var(--brand-green)]/70 text-sm leading-relaxed">
              We never compromise on the quality of our items. Every piece is thoroughly inspected to meet our luxury standards.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center text-[var(--brand-gold)] text-2xl font-display italic">2</div>
            <h3 className="text-xl font-semibold">Distinct Style</h3>
            <p className="text-[var(--brand-green)]/70 text-sm leading-relaxed">
              Our collections are curated for the bold and the beautiful. Stand out with fashion that redefines the norm.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--brand-gold)]/10 flex items-center justify-center text-[var(--brand-gold)] text-2xl font-display italic">3</div>
            <h3 className="text-xl font-semibold">Customer First</h3>
            <p className="text-[var(--brand-green)]/70 text-sm leading-relaxed">
              Your satisfaction is our priority. From checkout to delivery, expect seamless, concierge-level service.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
