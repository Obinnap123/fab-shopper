import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieName, verifyAdminToken } from "@/lib/auth";

export async function GET() {
  const token = cookies().get(adminCookieName)?.value;
  if (!token) {
    return NextResponse.json({ admin: null }, { status: 401 });
  }

  try {
    const payload = await verifyAdminToken(token);
    return NextResponse.json({ admin: payload });
  } catch {
    return NextResponse.json({ admin: null }, { status: 401 });
  }
}
