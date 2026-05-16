import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";
import { createExpiredSessionCookieOptions } from "@/lib/session-cookie";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: adminCookieName,
    value: "",
    ...createExpiredSessionCookieOptions()
  });
  return response;
}
