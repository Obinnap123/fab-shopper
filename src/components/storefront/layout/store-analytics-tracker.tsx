"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function StoreAnalyticsTracker() {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Only track once per page path change
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;

    // Fire and forget
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname })
    }).catch(() => {});
  }, [pathname]);

  return null;
}
