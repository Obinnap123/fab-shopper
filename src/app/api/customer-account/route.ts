import { NextResponse } from "next/server";
import { getActiveCustomerFromSession, getCustomerAccountPageData } from "@/lib/customer-account";
import { isHttpError } from "@/lib/http-error";
import { accountUpdateSchema } from "@/features/customer-account/schemas";
import { updateCustomerAccount } from "@/features/customer-account/service";

export async function GET() {
  const customer = await getActiveCustomerFromSession();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await getCustomerAccountPageData(customer.id);

  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  try {
    const customer = await getActiveCustomerFromSession();
    if (!customer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json().catch(() => null);
    const parsed = accountUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid account details", issues: parsed.error.flatten() }, { status: 400 });
    }

    await updateCustomerAccount(customer.id, parsed.data);

    const data = await getCustomerAccountPageData(customer.id);
    return NextResponse.json({ data, message: "Account updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update account" },
      { status: isHttpError(error) ? error.status : 500 }
    );
  }
}
