"use client";

import { useState } from "react";
import { markAsRead, markAllAsRead } from "./actions";
import { Bell, ShoppingCart, Banknote, CheckCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: string; 
  isRead: boolean;
  link: string | null;
  createdAt: Date;
};

export function NotificationsClient({ grouped }: { grouped: Record<string, AppNotification[]> }) {
  const [markingAll, setMarkingAll] = useState(false);

  const handleMarkAll = async () => {
    setMarkingAll(true);
    await markAllAsRead();
    setMarkingAll(false);
  };

  const getIconInfo = (type: string) => {
    switch (type) {
      case "ORDER": return { icon: ShoppingCart, bg: "bg-rose-50", color: "text-rose-500" };
      case "PAYMENT": return { icon: Banknote, bg: "bg-emerald-50", color: "text-emerald-500" };
      default: return { icon: Bell, bg: "bg-sky-50", color: "text-sky-500" };
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }).format(date);
  };

  if (Object.keys(grouped).length === 0) {
    return (
      <div className="rounded-3xl border border-forest/10 bg-white p-12 text-center shadow-sm mt-8">
        <Bell className="mx-auto h-12 w-12 text-forest/20 mb-4" />
        <h3 className="text-lg font-semibold text-forest">All caught up!</h3>
        <p className="text-forest/60 text-sm mt-1">You have no new notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-end">
        <button 
          onClick={handleMarkAll}
          disabled={markingAll}
          className="text-sm font-semibold text-[var(--brand-green)] hover:opacity-80 transition flex items-center gap-2"
        >
          <CheckCheck className="w-4 h-4" />
          {markingAll ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([dateKey, items]) => (
          <div key={dateKey} className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_12px_30px_rgba(26,60,46,0.06)] relative overflow-hidden">
            <h2 className="text-sm font-semibold text-forest mb-6 uppercase tracking-wider">{dateKey}</h2>
            
            <div className="space-y-6">
              {items.map((notif) => {
                const { icon: Icon, bg, color } = getIconInfo(notif.type);
                return (
                  <div 
                    key={notif.id} 
                    className={cn(
                      "flex gap-4 group transition-colors p-2 -mx-2 rounded-2xl",
                      !notif.isRead && "bg-forest/[0.04]"
                    )}
                  >
                    <div className="pt-1 relative">
                      {!notif.isRead && (
                        <span className="absolute -left-1 top-1 w-2 h-2 bg-rose-500 rounded-full" />
                      )}
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", bg, color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-semibold text-forest leading-tight">
                          {notif.title}
                        </h3>
                        <span className="text-[11px] text-forest/40 whitespace-nowrap ml-4 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                      <p className="text-[13px] text-forest/60 leading-relaxed mt-1">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
