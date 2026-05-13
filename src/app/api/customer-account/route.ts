import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getActiveCustomerFromSession, getCustomerAccountPageData } from "@/lib/customer-account";

const addressSchema = z.object({
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().optional().or(z.literal("")),
  state: z.string().trim().optional().or(z.literal("")),
  country: z.string().trim().optional().or(z.literal("")),
  zipCode: z.string().trim().optional().or(z.literal(""))
});

const accountUpdateSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  phone: z.string().trim().optional().or(z.literal("")),
  instagramHandle: z.string().trim().optional().or(z.literal("")),
  additionalInfo: z.string().trim().max(500, "Additional info is too long").optional().or(z.literal("")),
  subscribedToNewsletter: z.boolean().default(false),
  shippingAddress: addressSchema.nullable(),
  billingAddress: addressSchema.nullable()
});

function normalizeAddress(input: z.infer<typeof addressSchema> | null | undefined) {
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

    const shippingAddress = normalizeAddress(parsed.data.shippingAddress);
    const billingAddress = normalizeAddress(parsed.data.billingAddress);

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
          where: { id: customer.id },
          data: { shippingAddressId: null }
        });
        await tx.address.delete({ where: { id: shippingAddressId } });
        shippingAddressId = null;
      }

      if (billingAddress) {
        if (billingAddressId) {
          await tx.address.update({
            where: { id: billingAddressId },
            data: billingAddress
          });
        } else {
          const created = await tx.address.create({ data: billingAddress });
          billingAddressId = created.id;
        }
      } else if (billingAddressId) {
        await tx.customer.update({
          where: { id: customer.id },
          data: { billingAddressId: null }
        });
        await tx.address.delete({ where: { id: billingAddressId } });
        billingAddressId = null;
      }

      await tx.customer.update({
        where: { id: customer.id },
        data: {
          firstName: parsed.data.firstName,
          lastName: parsed.data.lastName,
          phone: parsed.data.phone?.trim() || null,
          instagramHandle: parsed.data.instagramHandle?.trim() || null,
          additionalInfo: parsed.data.additionalInfo?.trim() || null,
          subscribedToNewsletter: parsed.data.subscribedToNewsletter,
          shippingAddressId,
          billingAddressId
        }
      });
    });

    const data = await getCustomerAccountPageData(customer.id);
    return NextResponse.json({ data, message: "Account updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update account" },
      { status: 500 }
    );
  }
}
