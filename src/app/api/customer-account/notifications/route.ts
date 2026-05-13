import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveCustomerFromSession } from "@/lib/customer-account";

export async function PATCH() {
  const customer = await getActiveCustomerFromSession();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.customerNotification.updateMany({
    where: {
      customerId: customer.id,
      isRead: false
    },
    data: {
      isRead: true
    }
  });

  return NextResponse.json({ message: "Notifications marked as read" });
}
