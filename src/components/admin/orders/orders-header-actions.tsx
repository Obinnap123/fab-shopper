"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function OrdersHeaderActions() {
  const handleOpen = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("new", "1");
    window.history.replaceState(null, "", url.toString());
    window.dispatchEvent(new CustomEvent("open-order-modal"));
  };

  return (
    <div className="flex items-center gap-3">
      <Select defaultValue="Actions">
        <SelectTrigger className="h-10 px-5 rounded-full border border-forest/40 bg-forest/5 text-xs font-semibold uppercase tracking-[0.1em] text-forest hover:bg-forest/10 transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Actions">Actions</SelectItem>
          <SelectItem value="Export">Export</SelectItem>
          <SelectItem value="Bulk Update">Bulk Update</SelectItem>
        </SelectContent>
      </Select>
      <Button
        type="button"
        onClick={handleOpen}
        className="h-10 px-6 bg-forest hover:bg-forest/90 text-white font-semibold rounded-full flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Order
      </Button>
    </div>
  );
}
