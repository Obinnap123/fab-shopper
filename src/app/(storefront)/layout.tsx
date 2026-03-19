"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { AnnouncementBar } from "@/components/storefront/layout/announcement-bar";
import { StorefrontFooter } from "@/components/storefront/layout/footer";
import { StorefrontNavbar } from "@/components/storefront/layout/navbar";
import { CartDrawer } from "@/components/storefront/checkout/cart-drawer";

export default function StorefrontLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--brand-cream)] text-[var(--text-dark)]">
      <AnnouncementBar />
      <StorefrontNavbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
