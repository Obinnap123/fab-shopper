import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken, type AdminTokenPayload } from "@/lib/auth";

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  if (!token) return null;

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function requireSuperAdmin() {
  const admin = await getAdminSession();
  return admin?.role === "SUPER_ADMIN" ? admin : null;
}
