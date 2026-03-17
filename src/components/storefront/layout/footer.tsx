import Link from "next/link";

export function StorefrontFooter() {
  return (
    <footer className="border-t border-forest/15 bg-cream">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl text-forest">Fab Shopper</p>
          <p className="mt-3 text-sm text-forest/70">
            Luxury Lagos womenswear and accessories crafted for bold, modern elegance.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-forest/70">
            <li>
              <Link href="/shop">Shop All</Link>
            </li>
            <li>
              <Link href="/collections/new-arrivals">New Arrivals</Link>
            </li>
            <li>
              <Link href="/collections/best-sellers">Best Sellers</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-forest/70">
            <li>Instagram: @fabshopperng</li>
            <li>Phone: +234 812 000 0000</li>
            <li>Lagos, Nigeria</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
