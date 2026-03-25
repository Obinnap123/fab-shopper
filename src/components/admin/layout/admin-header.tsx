"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminHeaderData } from "./admin-header-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminHeader() {
  const [data, setData] = useState({ name: "Admin", unreadCount: 0 });

  useEffect(() => {
    getAdminHeaderData().then(setData);
  }, []);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-forest/10 bg-white px-6 py-3 shadow-[0_15px_40px_rgba(26,60,46,0.08)]">
      <div className="hidden sm:flex items-center gap-2 rounded-full border border-forest/10 bg-neutral-50 px-4 py-2 text-xs font-semibold text-forest/70">
        <span className="text-forest/60">Location:</span>
        <Select defaultValue="Headquarters">
          <SelectTrigger className="h-8 w-[180px] border-0 bg-transparent px-0 text-xs font-semibold text-forest">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Headquarters">Headquarters</SelectItem>
            <SelectItem value="Victoria Island">Victoria Island</SelectItem>
            <SelectItem value="Pop-up Studio">Pop-up Studio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/admin/notifications"
          className="relative rounded-full border border-forest/10 bg-white p-2.5 text-forest/60 hover:text-forest hover:bg-forest/5 transition"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {data.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
              {data.unreadCount > 99 ? '99+' : data.unreadCount}
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-forest/10 bg-white p-1 pr-4 sm:px-2 sm:py-1.5 text-sm text-forest">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 border border-forest/20 text-xs font-bold uppercase tracking-wider text-forest">
            {data.name.charAt(0)}
          </span>
          <span className="hidden sm:inline font-medium">{data.name}</span>
        </div>
      </div>
    </div>
  );
}
