"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAllAsRead() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).notification.updateMany({
    where: { isRead: false },
    data: { isRead: true }
  });
  revalidatePath("/admin/notifications");
}

export async function markAsRead(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).notification.update({
    where: { id },
    data: { isRead: true }
  });
  revalidatePath("/admin/notifications");
}
