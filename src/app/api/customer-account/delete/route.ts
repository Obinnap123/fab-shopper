import { NextResponse } from "next/server";
import { customerCookieName } from "@/lib/customer-auth";
import { getActiveCustomerFromSession } from "@/lib/customer-account";
import { prisma } from "@/lib/prisma";

function anonymizedEmail(customerId: string) {
  return `deleted-${customerId}@deleted.local`;
}

export async function DELETE() {
  const customer = await getActiveCustomerFromSession();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.$transaction(async (tx) => {
    const current = await tx.customer.findUnique({
      where: { id: customer.id },
      select: {
        shippingAddressId: true,
        billingAddressId: true
      }
    });

    if (!current) {
      throw new Error("Account not found");
    }

    await tx.customerNotification.deleteMany({
      where: { customerId: customer.id }
    });

    await tx.customer.update({
      where: { id: customer.id },
      data: {
        firstName: "Deleted",
        lastName: "Customer",
        email: anonymizedEmail(customer.id),
        password: null,
        phone: null,
        instagramHandle: null,
        additionalInfo: null,
        subscribedToNewsletter: false,
        welcomeEmailSent: false,
        shippingAddressId: null,
        billingAddressId: null,
        deletedAt: new Date()
      }
    });

    if (current.shippingAddressId) {
      await tx.address.delete({ where: { id: current.shippingAddressId } });
    }

    if (current.billingAddressId) {
      await tx.address.delete({ where: { id: current.billingAddressId } });
    }
  });

  const response = NextResponse.json({ message: "Account deleted permanently" });
  response.cookies.delete(customerCookieName);
  return response;
}
