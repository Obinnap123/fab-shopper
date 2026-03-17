import Link from "next/link";

export function StorefrontNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest/15 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl uppercase tracking-[0.2em] text-forest">
          Fab Shopper
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-forest">
          <Link href="/shop">Shop</Link>
          <Link href="/collections/new-arrivals">Collections</Link>
          <Link href="/search">Search</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>
    </header>
  );
}
