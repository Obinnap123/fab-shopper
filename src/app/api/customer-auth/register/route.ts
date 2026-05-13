import { NextResponse } from "next/server";
import { registerSchema } from "@/features/customer-auth/schemas";
import { createCustomerAuthResponse, registerCustomer } from "@/features/customer-auth/server";
import { sendWelcomeEmail } from "@/features/customer-auth/welcome-email";
import { createCustomerNotification } from "@/lib/customer-notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration details" }, { status: 400 });
    }

    const customer = await registerCustomer(parsed.data);
    await sendWelcomeEmail(customer);
    await createCustomerNotification({
      customerId: customer.id,
      title: "Welcome to Fab Shopper",
      message: "Your account is ready. Track orders, save your details, and stay updated from your account hub.",
      link: "/account",
      referenceKey: `welcome-${customer.id}`
    });

    return createCustomerAuthResponse(customer, "Registration successful", 201);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Email is already registered" ||
        error.message === "An account with this email was previously closed. Please contact support to restore it.")
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
