import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http-error";
import type { AccountUpdateInput, AddressInput } from "@/features/customer-account/schemas";

function normalizeAddress(input: AddressInput | null | undefined) {
  if (!input) {
    return null;
  }

  const hasValue = Object.values(input).some((value) => (value ?? "").toString().trim().length > 0);
  if (!hasValue) {
    return null;
  }

  return {
    address: input.address.trim(),
    city: input.city?.trim() || null,
    state: input.state?.trim() || null,
    country: input.country?.trim() || "Nigeria",
    zipCode: input.zipCode?.trim() || null
  };
}

export async function updateCustomerAccount(customerId: string, input: AccountUpdateInput) {
  const shippingAddress = normalizeAddress(input.shippingAddress);

  await prisma.$transaction(async (tx) => {
    const current = await tx.customer.findUnique({
      where: { id: customerId },
      select: {
        shippingAddressId: true,
        billingAddressId: true
      }
    });

    if (!current) {
      throw new HttpError("Account not found", 404);
    }

    let shippingAddressId = current.shippingAddressId;
    let billingAddressId = current.billingAddressId;

    if (shippingAddress) {
      if (shippingAddressId) {
        await tx.address.update({
          where: { id: shippingAddressId },
          data: shippingAddress
        });
      } else {
        const created = await tx.address.create({ data: shippingAddress });
        shippingAddressId = created.id;
      }
    } else if (shippingAddressId) {
      await tx.customer.update({
        where: { id: customerId },
        data: { shippingAddressId: null }
      });
      await tx.address.delete({ where: { id: shippingAddressId } });
      shippingAddressId = null;
    }

    if (billingAddressId) {
      await tx.customer.update({
        where: { id: customerId },
        data: { billingAddressId: null }
      });
      await tx.address.delete({ where: { id: billingAddressId } });
      billingAddressId = null;
    }

    await tx.customer.update({
      where: { id: customerId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone?.trim() || null,
        instagramHandle: input.instagramHandle?.trim() || null,
        additionalInfo: input.additionalInfo?.trim() || null,
        subscribedToNewsletter: input.subscribedToNewsletter,
        shippingAddressId,
        billingAddressId
      }
    });
  });
}
