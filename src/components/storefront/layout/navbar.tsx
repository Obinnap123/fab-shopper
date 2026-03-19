"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const collections = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Shoes", href: "/collections/shoes" },
  { label: "Bags", href: "/collections/bags" },
  { label: "Clothing", href: "/collections/clothing" },
  { label: "Perfumes", href: "/collections/perfumes" },
  { label: "Accessories", href: "/collections/accessories" }
];

export function StorefrontNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, openCart } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-10 z-40 transition duration-300 ${
          scrolled ? "bg-[var(--brand-green)]/95 border-b border-[rgba(201,168,76,0.2)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex flex-col">
            <span
              className="text-[22px] font-semibold tracking-[0.2em] text-[var(--brand-gold)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              FAB SHOPPER
            </span>
            <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--brand-gold)]/70">
              Delight Closet Revolution
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[13px] uppercase tracking-[0.08em] text-[var(--brand-cream)] md:flex">
            <Link href="/shop" className="transition hover:text-[var(--brand-gold)]">
              Shop
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button className="transition hover:text-[var(--brand-gold)]">Collections</button>
              <AnimatePresence>
                {collectionsOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-7 w-52 rounded-2xl border border-[rgba(201,168,76,0.2)] bg-[var(--brand-green)] p-3 shadow-xl"
                  >
                    {collections.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-lg px-3 py-2 text-sm text-[var(--brand-cream)] transition hover:bg-[rgba(201,168,76,0.12)] hover:text-[var(--brand-gold)]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <Link href="/about" className="transition hover:text-[var(--brand-gold)]">
              About
            </Link>
            <Link href="/contact" className="transition hover:text-[var(--brand-gold)]">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.3)] text-[var(--brand-gold)] transition hover:bg-[rgba(201,168,76,0.12)]"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.3)] text-[var(--brand-gold)] transition hover:bg-[rgba(201,168,76,0.12)]"
              aria-label="Cart"
              onClick={openCart}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-gold)] text-[10px] font-semibold text-[var(--brand-green)]">
                {itemCount()}
              </span>
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(201,168,76,0.3)] text-[var(--brand-gold)] transition hover:bg-[rgba(201,168,76,0.12)] md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,25,15,0.9)] p-6"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <input
                className="h-14 w-full rounded-full border border-[rgba(201,168,76,0.4)] bg-transparent px-6 text-base text-white placeholder:text-white/60 focus:outline-none"
                placeholder="Search products..."
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[rgba(10,25,15,0.6)] md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-[78vw] max-w-xs bg-[var(--brand-green)] p-6 text-[var(--brand-cream)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="space-y-4 text-sm uppercase tracking-[0.12em]">
                <Link href="/shop">Shop</Link>
                <Link href="/collections/new-arrivals">Collections</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
