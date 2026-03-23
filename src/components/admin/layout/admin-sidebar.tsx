"use client";

import { useMemo, useState, useEffect } from "react";
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
import { getAdminRole } from "./admin-sidebar-action";

const ALL_SECTIONS = [
  { title: "Dashboard", href: "/admin", icon: LayoutGrid },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    icon: CalendarCheck,
    href: "/admin/orders",
    items: [
      { label: "Abandoned Orders", href: "/admin/orders/abandoned" },
    ],
  },
  {
    title: "Customers",
    icon: UserCircle,
    href: "/admin/customers",
  },
  {
    title: "Analytics",
    icon: ChartNoAxesColumn,
    href: "/admin/analytics",
  },
  {
    title: "Operations",
    icon: Truck,
    href: "/admin/shipping",
    items: [
      { label: "Staff Accounts", href: "/admin/staff" },
      { label: "Store Location", href: "/admin/store/location" },
      { label: "General Settings", href: "/admin/store/general-settings" }
    ]
  },
  {
    title: "Finance",
    icon: CreditCard,
    href: "/admin/finance/transactions",
  },
  {
    title: "Store Setup",
    icon: Settings,
    href: "/admin/store/information",
  },
  { title: "Extensions", href: "/admin/apps", icon: Boxes },
];

type AdminSidebarProps = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getAdminRole().then(setRole);
  }, []);

  const navSections = useMemo(() => {
    if (role === "STAFF") {
      return ALL_SECTIONS.filter(
        (s) => !["Analytics", "Finance", "Store Setup"].includes(s.title)
      );
    }
    return ALL_SECTIONS;
  }, [role]);

  const initialOpen = useMemo(() => {
    const open: Record<string, boolean> = {};
    navSections.forEach((section) => {
      if (section.items?.some((item) => pathname.startsWith(item.href))) {
        open[section.title] = true;
      }
    });
    return open;
  }, [pathname, navSections]);

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>(initialOpen);

  useEffect(() => {
    setOpenSections(initialOpen);
  }, [initialOpen]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="flex h-full min-h-0 w-full max-w-[260px] flex-col bg-forest text-cream">
      <div className="hidden px-4 py-8 sm:px-6 lg:px-10 lg:block">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/80">
          Fab Shopper
        </p>
        <h2 className="mt-2 text-2xl font-serif font-semibold text-cream">Admin</h2>
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
              <div
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-cream/15 text-cream"
                    : "text-cream/80 hover:bg-cream/10",
                )}
              >
                {section.href ? (
                  <Link
                    href={section.href}
                    onClick={onNavigate}
                    className="flex flex-1 items-center gap-3"
                  >
                    <Icon className="h-4 w-4 text-gold" />
                    {section.title}
                  </Link>
                ) : (
                  <span className="flex flex-1 items-center gap-3">
                    <Icon className="h-4 w-4 text-gold" />
                    {section.title}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="rounded-full p-1 transition hover:bg-cream/10"
                  aria-label={`Toggle ${section.title}`}
                >
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition",
                      isOpen ? "rotate-180" : "",
                    )}
                  />
                </button>
              </div>
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
                    "overflow-hidden pl-8 text-sm text-cream/70 transition-all duration-300",
                    isOpen ? "translate-y-0" : "-translate-y-2",
                  )}
                >
                  {section.items?.map((item) => {
                    const itemActive = pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
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
                          <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
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
