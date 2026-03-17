"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminHeader } from "@/components/admin/layout/admin-header";
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative h-dvh overflow-hidden bg-neutral-50 text-neutral-900">
      <div className="grid h-full min-h-0 grid-cols-1 md:grid-cols-[260px_1fr]">
        <div className="hidden h-dvh md:flex">
          <AdminSidebar />
        </div>

        <div className="flex h-full min-h-0 flex-col">
          <div className="sticky top-0 z-30 shrink-0 bg-neutral-50/90 backdrop-blur">
            <div className="flex items-center justify-between px-6 pt-6 md:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="flex items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-forest"
              >
                <Menu className="h-4 w-4" />
                Menu
              </button>
              <span className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">
                Fab Shopper
              </span>
            </div>
            <div className="px-6 pb-6 pt-4 md:px-10 md:pb-8">
              <AdminHeader />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-10 md:px-10 scrollbar-hide overscroll-contain">
            {children}
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 h-full w-[82vw] max-w-xs bg-forest text-cream shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-gold">Fab Shopper</p>
                <p className="text-lg font-semibold">Admin</p>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-cream/20 p-2"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
