"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { AnnouncementBar } from "@/components/storefront/layout/announcement-bar";
import { Navbar } from "@/components/storefront/layout/navbar";
import { StorefrontFooter } from "@/components/storefront/layout/footer";
import { CartDrawer } from "@/components/storefront/checkout/cart-drawer";
import { WhatsAppWidget } from "@/components/storefront/layout/whatsapp-widget";
import { StoreAnalyticsTracker } from "@/components/storefront/layout/store-analytics-tracker";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[var(--brand-cream)] text-[var(--text-dark)]">
      {/* Announcement bar — fixed at very top */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 60 }}>
        <AnnouncementBar />
      </div>

      {/* Navbar — fixed below announcement bar */}
      <Navbar />

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
      <WhatsAppWidget />
      <StoreAnalyticsTracker />
    </div>
  );
}
