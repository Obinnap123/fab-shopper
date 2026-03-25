"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken, signAdminToken } from "@/lib/auth";

export async function updateAdminProfile(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  if (!token) return { error: "Unauthorized" };

  const payload = await verifyAdminToken(token).catch(() => null);
  if (!payload) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name) return { error: "Name is required" };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { name };
  if (password && password.length >= 8) {
    updateData.password = await bcrypt.hash(password, 12);
  } else if (password) {
    return { error: "Password must be at least 8 characters" };
  }

  const updatedAdmin = await prisma.admin.update({
    where: { email: payload.email },
    data: updateData
  });

  // Re-sign token with new name
  const newToken = await signAdminToken({
    id: updatedAdmin.id,
    email: updatedAdmin.email,
    name: updatedAdmin.name,
    role: updatedAdmin.role
  });

  cookieStore.set({
    name: adminCookieName,
    value: newToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return { success: true };
}
