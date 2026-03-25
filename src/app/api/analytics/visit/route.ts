import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    // Hash IP + Agent to maintain privacy while ensuring unique daily counts
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + userAgent);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const ipHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    
    // Get current date string (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Upsert to ensure uniqueness constraint is handled gracefully
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).storeVisit.upsert({
      where: {
        date_ipHash: {
          date: today,
          ipHash: ipHash
        }
      },
      update: {},
      create: {
        date: today,
        ipHash: ipHash
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // Silently fail so it never breaks the site or causes client errors
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
