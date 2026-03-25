import Link from "next/link";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
);

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
          
          <div className="flex items-center gap-4 pt-4 text-[var(--brand-gold)]">
            <a href="https://instagram.com/fab_shopper2" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="https://facebook.com/fabshopper" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href="https://x.com/fabshopper" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="X (Twitter)">
              <XIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Shop</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/collections/new-arrivals" className="hover:text-[var(--brand-gold)] transition-colors">New Arrivals</Link>
            </li>
            <li>
              <Link href="/collections/womens-shoes" className="hover:text-[var(--brand-gold)] transition-colors">Women&apos;s Shoes</Link>
            </li>
            <li>
              <Link href="/collections/mens-shoes" className="hover:text-[var(--brand-gold)] transition-colors">Men&apos;s Shoes</Link>
            </li>
            <li>
              <Link href="/collections/bags" className="hover:text-[var(--brand-gold)] transition-colors">Bags</Link>
            </li>
            <li>
              <Link href="/collections/clothing" className="hover:text-[var(--brand-gold)] transition-colors">Clothing</Link>
            </li>
            <li>
              <Link href="/collections/perfumes" className="hover:text-[var(--brand-gold)] transition-colors">Perfumes</Link>
            </li>
            <li>
              <Link href="/collections/accessories" className="hover:text-[var(--brand-gold)] transition-colors">Accessories</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Information</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/about" className="hover:text-[var(--brand-gold)] transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--brand-gold)] transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-[var(--brand-gold)] transition-colors">Shipping Policy</Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-[var(--brand-gold)] transition-colors">Return Policy</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-[var(--brand-gold)] transition-colors">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li>Shop A23, Justice Mall, Nnobi Lane, SPG Bus Stop, Lekki, Lagos</li>
            <li>Store line (call only): +234 905 261 3150</li>
            <li>delightclosetrevolution@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[rgba(201,168,76,0.1)]">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-xs text-white/50">
          <span>
            © 2025 Fab Shopper. All rights reserved.
            <Link href="/admin/login" className="ml-4 font-medium opacity-40 hover:opacity-100 transition-opacity">Staff Login</Link>
          </span>
          <span className="rounded-full border border-[rgba(201,168,76,0.4)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--brand-gold)] flex items-center gap-2">
            Secured by Paystack
          </span>
        </div>
      </div>
    </footer>
  );
}
