import { NextResponse } from "next/server";
import { isHttpError } from "@/lib/http-error";
import { createOrderSchema } from "@/features/orders/order-schemas";
import { createAdminOrder, listOrders } from "@/features/orders/order-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const result = await listOrders({
    take: Number(searchParams.get("take") ?? 20),
    skip: Number(searchParams.get("skip") ?? 0),
    search: searchParams.get("search")?.trim(),
    dateRange: searchParams.get("dateRange") ?? "all",
    delivery: searchParams.get("delivery") ?? "all"
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = await createAdminOrder(parsed.data);
    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: isHttpError(error) ? error.status : 500 }
    );
  }
}
