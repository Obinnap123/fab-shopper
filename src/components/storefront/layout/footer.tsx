import Link from "next/link";

export function StorefrontFooter() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.15)] bg-[var(--brand-green-dark)] text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-4">
        <div className="space-y-4">
          <p
            className="text-2xl text-[var(--brand-gold)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            FAB SHOPPER
          </p>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            Delight Closet Revolution
          </p>
          <p className="text-sm text-white/60">
            Premium Lagos fashion boutique for designer shoes, bags, perfumes and
            statement clothing.
          </p>
          <p className="text-sm text-white/60">Instagram: @fab_shopper2</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/collections/new-arrivals">New Arrivals</Link>
            </li>
            <li>
              <Link href="/collections/womens-shoes">Women&apos;s Shoes</Link>
            </li>
            <li>
              <Link href="/collections/mens-shoes">Men&apos;s Shoes</Link>
            </li>
            <li>
              <Link href="/collections/bags">Bags</Link>
            </li>
            <li>
              <Link href="/collections/clothing">Clothing</Link>
            </li>
            <li>
              <Link href="/collections/perfumes">Perfumes</Link>
            </li>
            <li>
              <Link href="/collections/accessories">Accessories</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Information</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>
              <Link href="/shipping">Shipping Policy</Link>
            </li>
            <li>
              <Link href="/returns">Return Policy</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li>Shop A23, Justice Mall, Nnobi Lane, SPG Bus Stop, Lekki, Lagos</li>
            <li>Store line (call only): +234 905 261 3150</li>
            <li>@fab_shopper2</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgba(201,168,76,0.1)]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-white/50">
          <span>© 2025 Fab Shopper. All rights reserved.</span>
          <span className="rounded-full border border-[rgba(201,168,76,0.4)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--brand-gold)]">
            Secured by Paystack
          </span>
        </div>
      </div>
    </footer>
  );
}
