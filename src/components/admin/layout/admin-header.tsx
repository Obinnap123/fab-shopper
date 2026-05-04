"use client";

import { Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getAdminHeaderData } from "./admin-header-actions";

const locations = ["Headquarters", "Victoria Island", "Pop-up Studio"];

export function AdminHeader() {
  const [data, setData] = useState({ name: "Admin", unreadCount: 0 });
  const [location, setLocation] = useState("Headquarters");
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getAdminHeaderData().then(setData);
  }, []);

  useEffect(() => {
    if (!locationOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!locationRef.current?.contains(event.target as Node)) {
        setLocationOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLocationOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [locationOpen]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-forest/10 bg-white px-6 py-3 shadow-[0_15px_40px_rgba(26,60,46,0.08)]">
      <div ref={locationRef} className="relative hidden sm:flex items-center gap-2 rounded-full border border-forest/10 bg-neutral-50 px-4 py-2 text-xs font-semibold text-forest/70">
        <span className="text-forest/60">Location:</span>
        <button
          type="button"
          className="flex h-8 w-[180px] items-center justify-between rounded-full px-0 text-left text-xs font-semibold text-forest transition hover:text-forest/80"
          aria-label="Admin location"
          aria-expanded={locationOpen}
          onClick={() => setLocationOpen((open) => !open)}
        >
          <span>{location}</span>
          <ChevronDown
            className={`h-4 w-4 text-forest/50 transition-transform ${
              locationOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {locationOpen ? (
          <div className="absolute left-24 top-[calc(100%+8px)] z-[80] w-[210px] rounded-2xl border border-forest/15 bg-white p-2 shadow-lg">
            {locations.map((option) => (
              <button
                key={option}
                type="button"
                className={`flex w-full items-center rounded-xl px-3 py-2 text-left text-sm transition ${
                  option === location
                    ? "bg-forest/10 font-semibold text-forest"
                    : "text-forest/70 hover:bg-forest/5 hover:text-forest"
                }`}
                onClick={() => {
                  setLocation(option);
                  setLocationOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : null}
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
