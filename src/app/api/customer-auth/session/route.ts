import { NextResponse } from "next/server";
import { getCustomerSessionSnapshot } from "@/lib/customer-account";

export async function GET() {
  const session = await getCustomerSessionSnapshot();
  return NextResponse.json(
    { data: session },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
      }
    }
  );
}
