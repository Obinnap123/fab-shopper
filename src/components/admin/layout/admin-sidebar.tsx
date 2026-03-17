"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  CalendarCheck,
  ChartNoAxesColumn,
  ChevronDown,
  CreditCard,
  LayoutGrid,
  Package,
  Settings,
  Truck,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  { title: "Dashboard", href: "/admin", icon: LayoutGrid },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    icon: CalendarCheck,
    items: [
      { label: "Orders", href: "/admin/orders" },
      { label: "Abandoned Orders", href: "/admin/orders/abandoned" },
    ],
  },
  {
    title: "Customers",
    icon: UserCircle,
    items: [
      { label: "All Customers", href: "/admin/customers" },
      { label: "Customer Groups", href: "/admin/customers/groups" },
      { label: "Newsletter", href: "/admin/customers/newsletter" },
    ],
  },
  {
    title: "Analytics",
    icon: ChartNoAxesColumn,
    items: [
      { label: "Sales", href: "/admin/analytics" },
      { label: "Transactions", href: "/admin/analytics/transactions" },
      { label: "Products", href: "/admin/analytics/products" },
      { label: "Customers", href: "/admin/analytics/customers" },
      { label: "Campaigns", href: "/admin/analytics/campaigns" },
    ],
  },
  {
    title: "Operations",
    icon: Truck,
    items: [
      { label: "Shipping Methods", href: "/admin/shipping" },
      { label: "Staff Accounts", href: "/admin/staff" },
      { label: "Store Location", href: "/admin/store/location" },
    ],
  },
  {
    title: "Finance",
    icon: CreditCard,
    items: [
      { label: "Transactions", href: "/admin/finance/transactions" },
      { label: "Expenses", href: "/admin/finance/expenses" },
      { label: "Payment Methods", href: "/admin/finance/payment-methods" },
      { label: "Bank Details", href: "/admin/finance/bank-details" },
    ],
  },
  {
    title: "Store Setup",
    icon: Settings,
    items: [
      { label: "Store Information", href: "/admin/store/information" },
      { label: "Taxes", href: "/admin/store/taxes" },
      { label: "General Settings", href: "/admin/store/general-settings" },
      { label: "Connected Apps", href: "/admin/store/apps" },
    ],
  },
  { title: "Extensions", href: "/admin/apps", icon: Boxes },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const initialOpen = useMemo(() => {
    const open: Record<string, boolean> = {};
    navSections.forEach((section) => {
      if (section.items?.some((item) => pathname.startsWith(item.href))) {
        open[section.title] = true;
      }
    });
    return open;
  }, [pathname]);

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(initialOpen);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="flex h-full min-h-0 w-full max-w-[260px] flex-col border-r border-forest/15 bg-forest text-cream">
      <div className="hidden px-6 py-6 md:block">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">
          Fab Shopper
        </p>
        <h2 className="mt-2 text-xl font-semibold">Admin</h2>
      </div>
      <nav className="flex-1 min-h-0 space-y-6 overflow-y-auto px-4 pb-10 pt-4 scrollbar-hide overscroll-contain md:pt-0">
        {navSections.map((section) => {
          const Icon = section.icon;
          const isActive = section.href
            ? pathname === section.href
            : section.items?.some((item) => pathname.startsWith(item.href));
          const isOpen = openSections[section.title] ?? false;

          if (section.href && !section.items) {
            return (
              <Link
                key={section.title}
                href={section.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-cream/15 text-cream"
                    : "text-cream/80 hover:bg-cream/10",
                )}
              >
                <Icon className="h-4 w-4 text-gold" />
                {section.title}
              </Link>
            );
          }

          return (
            <div key={section.title} className="space-y-2">
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-cream/15 text-cream"
                    : "text-cream/80 hover:bg-cream/10",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-gold" />
                  {section.title}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition",
                    isOpen ? "rotate-180" : "",
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0",
                )}
              >
                <ul
                  className={cn(
                    "relative overflow-hidden pl-10 text-sm text-cream/70 transition-all duration-300",
                    "before:absolute before:left-2 before:top-1 before:bottom-1 before:w-px before:bg-cream/40 before:content-['']",
                    isOpen ? "translate-y-0" : "-translate-y-2",
                  )}
                >
                  {section.items?.map((item) => {
                    const itemActive = pathname.startsWith(item.href);
                    return (
                      <li key={item.href} className="relative">
                        <span className="pointer-events-none absolute left-2 top-0 text-cream/40">
                          <svg
                            viewBox="0 0 12 16"
                            className="h-4 w-4"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path
                              d="M0 0v8c0 3 2 5 5 5h7"
                              stroke="currentColor"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center gap-2 rounded-xl px-3 py-2 transition",
                            itemActive
                              ? "bg-cream/15 text-cream"
                              : "hover:bg-cream/10",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
