"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ShoppingCart, Menu, X, User, Heart, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useCartStore } from "@/stores/cartStore"
import { useWishlistStore } from "@/stores/wishlistStore"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  
  const pathname = usePathname()
  const router = useRouter()
  
  const itemCount = useCartStore((state) => state.itemCount())
  const openCart = useCartStore((state) => state.openCart)
  const wishlistCount = useWishlistStore((state) => state.itemCount())

  const isHomepage = pathname === "/"

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent scrolling when mobile menu or search is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen, searchOpen])

  // Navbar is transparent on homepage until scrolled
  const isTransparent = isHomepage && !scrolled

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "#", hasDropdown: true },
    { label: "About", href: "/about" },
  ]

  const collections = [
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Women's Shoes", href: "/collections/womens-shoes" },
    { label: "Men's Shoes", href: "/collections/mens-shoes" },
    { label: "Bags & Purses", href: "/collections/bags" },
    { label: "Clothing", href: "/collections/clothing" },
    { label: "Perfumes", href: "/collections/perfumes" },
    { label: "Accessories", href: "/collections/accessories" },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchOpen(false)
      setMobileMenuOpen(false)
      router.push(`/shop?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["live-search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&take=4`);
      const json = await res.json();
      return json.data;
    },
    enabled: searchQuery.trim().length > 1,
  });

  const headerBg = isTransparent ? "transparent" : "var(--brand-cream)"
  const headerText = isTransparent ? "white" : "var(--brand-green)"
  const headerBorder = isTransparent ? "transparent" : "rgba(26,60,46,0.1)"
  const activeLinkBorder = "var(--brand-gold)"

  // Animation variants for staggered menu items
  const menuContainerAttrs = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const menuItemAttrs = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 40, // Below announcement bar
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "all 0.35s ease",
          background: headerBg,
          color: headerText,
          borderBottom: `1px solid ${headerBorder}`,
        }}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 md:px-8">
          {/* LEFT COMPOSITE: Logo + Navigation links */}
          <div className="flex items-center gap-6 lg:gap-12">
            {/* Logo */}
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-start justify-center text-left" style={{ textDecoration: 'none' }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  color: "var(--brand-gold)",
                  lineHeight: 1,
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Fab Shopper
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: isTransparent ? "rgba(255,255,255,0.7)" : "var(--brand-green)",
                  opacity: 0.8,
                  margin: "4px 0 0",
                  lineHeight: 1,
                  transition: "color 0.35s ease",
                }}
              >
                Delight Closet Revolution
              </p>
            </Link>

            {/* Navigation links - hidden on tablet/mobile (lg breakpoint) */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setCollectionsOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setCollectionsOpen(false)}
                >
                  <Link
                    href={link.href}
                    className="font-body text-[13px] uppercase tracking-[0.08em] transition-colors pb-1"
                    style={{
                      color: "inherit",
                      borderBottom: pathname === link.href ? `1px solid ${activeLinkBorder}` : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      ;(e.target as HTMLElement).style.color = "var(--brand-gold)"
                    }}
                    onMouseLeave={(e) => {
                      ;(e.target as HTMLElement).style.color = "inherit"
                    }}
                  >
                    {link.label}
                  </Link>

                  {/* Collections Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {collectionsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 top-[calc(100%+16px)] z-50 min-w-[220px] rounded bg-white py-2 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-[rgba(26,60,46,0.1)]"
                        >
                          {collections.map((col) => (
                            <Link
                              key={col.href}
                              href={col.href}
                              className="block px-6 py-2.5 font-body text-[13px] tracking-[0.04em] text-[var(--brand-green)] transition-colors hover:bg-[var(--brand-cream)] hover:text-[var(--brand-gold)]"
                            >
                              {col.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* RIGHT: Action items (Search, User, Wishlist, Cart) */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Search Bar (Desktop - lg instead of md) */}
            <form 
              onSubmit={handleSearchSubmit}
              className="hidden lg:flex items-center gap-2 rounded-full border px-4 py-1.5 transition-colors"
              style={{
                borderColor: isTransparent && !searchOpen ? "rgba(255,255,255,0.3)" : "rgba(26,60,46,0.2)",
                background: isTransparent && !searchOpen ? "rgba(255,255,255,0.1)" : "rgba(26,60,46,0.03)"
              }}
            >
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products" 
                className="w-48 bg-transparent text-[13px] outline-none placeholder:text-inherit placeholder:opacity-60"
              />
              <button type="submit" aria-label="Search" className="hover:text-[var(--brand-gold)] transition-colors">
                <Search className="w-4 h-4 opacity-70" strokeWidth={1.25} />
              </button>
            </form>

            {/* Search Icon (Mobile/Tablet) */}
            <button 
              className="lg:hidden hover:text-[var(--brand-gold)] transition-colors" 
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" strokeWidth={1.25} />
            </button>

            {/* User Account */}
            <Link href="/login" className="hidden lg:flex hover:text-[var(--brand-gold)] transition-colors" aria-label="Account">
              <User className="w-[18px] h-[18px]" strokeWidth={1.25} />
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden lg:flex hover:text-[var(--brand-gold)] transition-colors relative" aria-label="Wishlist">
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.25} />
              <span className="absolute -top-1.5 -right-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-black text-[8px] font-bold text-white shadow-sm">
                {isMounted ? wishlistCount : 0}
              </span>
            </Link>

            {/* Cart (Visible everywhere) */}
            <button onClick={openCart} className="hover:text-[var(--brand-gold)] transition-colors relative" aria-label="Cart">
              <ShoppingCart className="w-[18px] h-[18px]" strokeWidth={1.25} />
              <span className="absolute -top-1.5 -right-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-black text-[8px] font-bold text-white shadow-sm">
                {isMounted ? itemCount : 0}
              </span>
            </button>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden hover:text-[var(--brand-gold)] transition-colors z-[110]"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
            >
               {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.25} /> : <Menu className="w-6 h-6" strokeWidth={1.25} />}
            </button>
          </div>
        </div>

        {/* Overlay for auto-closing search dropdown on outside click */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
              style={{ top: '72px' }}
              onClick={() => setSearchOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white border-t border-[rgba(26,60,46,0.1)] relative z-50"
            >
              <div className="px-5 py-4">
                <form 
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-3 rounded-xl border border-[rgba(26,60,46,0.2)] bg-[rgba(26,60,46,0.02)] px-4 py-2"
                >
                  <Search className="w-5 h-5 text-[var(--brand-green)] opacity-50" strokeWidth={1.25} />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--brand-green)] placeholder:opacity-50 text-[var(--brand-green)]"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="text-[var(--brand-green)] hover:opacity-70">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Live Search Results */}
                {searchQuery.trim().length > 1 && (
                  <div className="mt-4 border-t border-[rgba(26,60,46,0.1)] pt-4 px-2 space-y-4 max-h-[60vh] overflow-y-auto">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-green)] opacity-50" />
                      </div>
                    ) : searchResults?.length > 0 ? (
                      <>
                        {searchResults.map((product: any) => (
                          <Link 
                            key={product.id} 
                            href={`/shop/${product.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-4 group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-[rgba(26,60,46,0.05)] overflow-hidden shrink-0 relative">
                              {product.images?.[0] && (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[var(--brand-green)] group-hover:text-[var(--brand-gold)] transition-colors line-clamp-1">{product.name}</p>
                              <p className="text-xs text-[var(--brand-green)]/70 mt-0.5">₦{product.price.toLocaleString()}</p>
                            </div>
                          </Link>
                        ))}
                        <button
                          onClick={handleSearchSubmit}
                          className="w-full py-2.5 mt-2 bg-[var(--brand-cream)] text-[12px] uppercase tracking-widest text-[var(--brand-green)] font-semibold rounded-xl border border-[rgba(26,60,46,0.1)] hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] transition-colors"
                        >
                          View All Results
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-center py-4 text-[var(--brand-green)]/60">No products found.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Premium Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-[85%] max-w-sm h-full bg-[var(--brand-cream)] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-[rgba(26,60,46,0.1)]">
                <span className="font-display text-xl uppercase tracking-widest text-[var(--brand-gold)]">Menu</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-[var(--brand-green)] hover:text-[var(--brand-gold)] transition-colors"
                >
                  <X className="w-6 h-6" strokeWidth={1.25} />
                </button>
              </div>

              {/* Drawer Links */}
              <motion.div 
                variants={menuContainerAttrs}
                initial="hidden"
                animate="show"
                className="flex flex-col py-6 px-8 gap-6"
              >
                {[
                  { label: "Home", href: "/" },
                  { label: "Shop", href: "/shop" },
                  { label: "New Arrivals", href: "/collections/new-arrivals" },
                  { label: "Women's Shoes", href: "/collections/womens-shoes" },
                  { label: "Men's Shoes", href: "/collections/mens-shoes" },
                  { label: "Bags & Purses", href: "/collections/bags" },
                  { label: "Clothing", href: "/collections/clothing" },
                  { label: "Accessories", href: "/collections/accessories" },
                  { label: "About", href: "/about" },
                ].map((link) => (
                  <motion.div variants={menuItemAttrs} key={link.label}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block font-body text-[16px] uppercase tracking-[0.08em] text-[var(--brand-green)] hover:text-[var(--brand-gold)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-auto p-8 bg-[rgba(26,60,46,0.03)] border-t border-[rgba(26,60,46,0.1)]">
                <div className="flex flex-col gap-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[14px] uppercase tracking-[0.06em] text-[var(--brand-green)] hover:text-[var(--brand-gold)] transition-colors">
                    <User className="w-5 h-5" strokeWidth={1.25} /> Account
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-[14px] uppercase tracking-[0.06em] text-[var(--brand-green)] hover:text-[var(--brand-gold)] transition-colors">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5" strokeWidth={1.25} /> Wishlist
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand-gold)] text-[10px] font-bold text-white shadow-sm">
                      {isMounted ? wishlistCount : 0}
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </>
  )
}
