import { AdminShell } from "@/components/admin/layout/admin-shell";
import { prisma } from "@/lib/prisma";
import { Bell, ShoppingCart, Banknote, CheckCheck } from "lucide-react";
import { NotificationsClient } from "@/app/admin/notifications/notifications-client";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notifications = await (prisma as any).notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });

  // Group by Date String
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped = notifications.reduce((acc: any, notif: any) => {
    // Format: "Today", "Yesterday", or "24 March 2026"
    const date = new Date(notif.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey = "";
    if (date.toDateString() === today.toDateString()) {
      dateKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = "Yesterday";
    } else {
      dateKey = new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(notif);
    return acc;
  }, {} as Record<string, typeof notifications>);

  return (
    <AdminShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[var(--brand-green)]">Notifications</h1>
        </div>

        <NotificationsClient grouped={grouped} />
      </div>
    </AdminShell>
  );
}
