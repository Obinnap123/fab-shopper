import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { isHttpError } from "@/lib/http-error";
import { checkoutSchema } from "@/features/orders/order-schemas";
import { createCheckoutOrder } from "@/features/orders/order-service";

export async function POST(request: Request) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsedBody = checkoutSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({ error: "Invalid checkout payload", issues: parsedBody.error.flatten() }, { status: 400 });
    }

    const checkout = await createCheckoutOrder(session, parsedBody.data);
    return NextResponse.json(checkout);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process checkout" },
      { status: isHttpError(error) ? error.status : 500 }
    );
  }
}
