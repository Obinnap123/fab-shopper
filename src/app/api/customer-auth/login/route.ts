import { NextResponse } from "next/server";
import { loginSchema } from "@/features/customer-auth/schemas";
import { authenticateCustomer, createCustomerAuthResponse } from "@/features/customer-auth/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid login details" }, { status: 400 });
    }

    const customer = await authenticateCustomer(parsed.data);
    if (!customer) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return createCustomerAuthResponse(customer, "Login successful", 200);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
