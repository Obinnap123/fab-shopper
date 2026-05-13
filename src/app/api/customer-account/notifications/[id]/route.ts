import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveCustomerFromSession } from "@/lib/customer-account";

export async function PATCH(_: Request, context: { params: Promise<{ id: string }> }) {
  const customer = await getActiveCustomerFromSession();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;

  const notification = await prisma.customerNotification.findFirst({
    where: {
      id,
      customerId: customer.id
    },
    select: { id: true }
  });

  if (!notification) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  await prisma.customerNotification.update({
    where: { id },
    data: { isRead: true }
  });

  return NextResponse.json({ message: "Notification updated" });
}
