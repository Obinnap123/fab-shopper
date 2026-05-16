import { NextResponse } from "next/server";
import { customerCookieName } from "@/lib/customer-auth";
import { createExpiredSessionCookieOptions } from "@/lib/session-cookie";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set({
    name: customerCookieName,
    value: "",
    ...createExpiredSessionCookieOptions()
  });
  return response;
}
