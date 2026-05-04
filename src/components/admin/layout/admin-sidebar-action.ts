"use server";

import { getAdminSession } from "@/lib/admin-auth";

export async function getAdminRole() {
  try {
    const admin = await getAdminSession();
    return admin?.role ?? null;
  } catch (error) {
    return null;
  }
}
