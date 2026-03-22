import { NextResponse } from "next/server";
import { customerCookieName } from "@/lib/customer-auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.delete(customerCookieName);
  return response;
}
