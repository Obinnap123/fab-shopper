'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'

export function StorefrontNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const pathname = usePathname()
  const itemCount = useCartStore(state => state.itemCount())
  const openCart = useCartStore(state => state.openCart)

  const isHomepage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navbar is transparent on homepage until scrolled
  const isTransparent = isHomepage && !scrolled

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '#', hasDropdown: true },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const collections = [
    { label: 'New Arrivals', href: '/collections/new-arrivals' },
    { label: "Women's Shoes", href: '/collections/womens-shoes' },
    { label: "Men's Shoes", href: '/collections/mens-shoes' },
    { label: 'Bags & Purses', href: '/collections/bags' },
    { label: 'Clothing', href: '/collections/clothing' },
    { label: 'Perfumes', href: '/collections/perfumes' },
    { label: 'Accessories', href: '/collections/accessories' },
  ]

  return (
    <header
      style={{
        position: 'fixed',
        // Sits directly below the marquee bar (40px tall)
        top: 40,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
        background: isTransparent
          ? 'transparent'
          : 'rgba(26, 60, 46, 0.97)',
        backdropFilter: isTransparent ? 'none' : 'blur(12px)',
        borderBottom: isTransparent
          ? '1px solid rgba(201, 168, 76, 0.0)'
          : '1px solid rgba(201, 168, 76, 0.15)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 32px',
          height: 72,
          display: 'grid',
          // 3-column grid: nav-left | logo-center | actions-right
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
        }}
      >
        {/* LEFT — Navigation links */}
        <nav
          style={{ display: 'flex', alignItems: 'center', gap: 36 }}
          className="hidden md:flex"
        >
          {navLinks.map(link => (
            <div
              key={link.label}
              style={{ position: 'relative' }}
              onMouseEnter={() => link.hasDropdown && setCollectionsOpen(true)}
              onMouseLeave={() => link.hasDropdown && setCollectionsOpen(false)}
            >
              <Link
                href={link.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: isTransparent
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  paddingBottom: 4,
                  // Underline on active page
                  borderBottom: pathname === link.href
                    ? '1px solid var(--brand-gold)'
                    : '1px solid transparent',
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.color = 'var(--brand-gold)'
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.color = isTransparent
                    ? 'rgba(255,255,255,0.9)'
                    : 'rgba(255,255,255,0.85)'
                }}
              >
                {link.label}
              </Link>

              {/* Collections dropdown */}
              {link.hasDropdown && (
                <AnimatePresence>
                  {collectionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 16px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#1A3C2E',
                        border: '1px solid rgba(201,168,76,0.2)',
                        borderRadius: 4,
                        padding: '8px 0',
                        minWidth: 200,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        zIndex: 100,
                      }}
                    >
                      {collections.map(col => (
                        <Link
                          key={col.href}
                          href={col.href}
                          style={{
                            display: 'block',
                            padding: '10px 20px',
                            fontFamily: 'var(--font-body)',
                            fontSize: 13,
                            color: 'rgba(255,255,255,0.75)',
                            textDecoration: 'none',
                            letterSpacing: '0.04em',
                            transition: 'color 0.15s, background 0.15s',
                          }}
                          onMouseEnter={e => {
                            const el = e.currentTarget
                            el.style.color = 'var(--brand-gold)'
                            el.style.background = 'rgba(201,168,76,0.08)'
                          }}
                          onMouseLeave={e => {
                            const el = e.currentTarget
                            el.style.color = 'rgba(255,255,255,0.75)'
                            el.style.background = 'transparent'
                          }}
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

        {/* CENTER — Logo */}
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            textAlign: 'center',
            display: 'block',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: 'var(--brand-gold)',
              lineHeight: 1,
              margin: 0,
              textTransform: 'uppercase',
            }}
          >
            Fab Shopper
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(201,168,76,0.6)',
              margin: '4px 0 0',
              lineHeight: 1,
            }}
          >
            Delight Closet Revolution
          </p>
        </Link>

        {/* RIGHT — Action icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 20,
          }}
        >
          {/* Search */}
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--brand-gold)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
            }}
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              padding: 4,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--brand-gold)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
            }}
            aria-label="Cart"
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  background: 'var(--brand-gold)',
                  color: 'var(--brand-green)',
                  borderRadius: '50%',
                  width: 16,
                  height: 16,
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              padding: 4,
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: 'hidden',
              background: '#1A3C2E',
              borderTop: '1px solid rgba(201,168,76,0.15)',
            }}
          >
            <div style={{ padding: '16px 32px 24px' }}>
              {[
                { label: 'Shop', href: '/shop' },
                { label: 'New Arrivals', href: '/collections/new-arrivals' },
                { label: "Women's Shoes", href: '/collections/womens-shoes' },
                { label: "Men's Shoes", href: '/collections/mens-shoes' },
                { label: 'Bags', href: '/collections/bags' },
                { label: 'Clothing', href: '/collections/clothing' },
                { label: 'Perfumes', href: '/collections/perfumes' },
                { label: 'Accessories', href: '/collections/accessories' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px 0',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.8)',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(201,168,76,0.08)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
