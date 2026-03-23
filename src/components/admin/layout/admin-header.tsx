"use client";

import { Bell } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminHeader() {
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

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-full border border-forest/10 bg-white p-2 text-forest/60 hover:text-forest"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-forest/10 bg-white p-1 sm:px-3 sm:py-2 text-sm text-forest">
          <span className="h-8 w-8 rounded-full bg-forest/10" />
          <span className="hidden sm:inline pr-2">Zikora Clinton Obi</span>
        </div>
      </div>
    </div>
  );
}
