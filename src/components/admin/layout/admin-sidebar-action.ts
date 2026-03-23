"use server";

import { cookies } from "next/headers";
import { verifyAdminToken, adminCookieName } from "@/lib/auth";

export async function getAdminRole() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(adminCookieName)?.value;
    if (!token) return null;
    const payload = await verifyAdminToken(token);
    return payload?.role;
  } catch (error) {
    return null;
  }
}
