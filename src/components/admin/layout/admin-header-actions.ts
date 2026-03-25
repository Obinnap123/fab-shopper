"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken } from "@/lib/auth";

export async function getAdminHeaderData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  let name = "Admin";
  
  if (token) {
    try {
      const payload = await verifyAdminToken(token);
      if (payload?.name) name = payload.name;
    } catch (e) {}
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unreadCount = await (prisma as any).notification.count({ 
    where: { isRead: false } 
  });
  
  return { name, unreadCount };
}
