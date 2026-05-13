import { NextResponse } from "next/server";
import { z } from "zod";

import { getCustomerSession } from "@/lib/customer-auth";
import { createCustomerNotification } from "@/lib/customer-notifications";
import { getPaystackPublicKey } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { ALLOWED_SHIPPING_FEES, DEFAULT_SHIPPING_FEE } from "@/lib/shipping-options";
import { calculateTotalWithVat, calculateVatAmount } from "@/lib/vat";

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.coerce.number().int().positive(),
      size: z.string().optional(),
      color: z.string().optional()
    })
  ).min(1),
  shippingDetails: z.object({
    fee: z.coerce.number().nonnegative().optional()
  }).optional()
});

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

    const { items, shippingDetails } = parsedBody.data;

    let subtotal = 0;
    const orderItems: {
      productId: string;
      variantId?: string;
      quantity: number;
      price: number;
      size?: string;
      color?: string;
    }[] = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      });

      if (!dbProduct) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (dbProduct.status === "OUT_OF_STOCK") {
        throw new Error(`${dbProduct.name} is out of stock`);
      }

      let selectedVariant = undefined;
      if (item.size || item.color) {
        selectedVariant = dbProduct.variants.find((variant) => {
          const sizeMatches = item.size ? variant.size === item.size : true;
          const colorMatches = item.color ? variant.color === item.color : true;
          return sizeMatches && colorMatches;
        });

        if (!selectedVariant) {
          throw new Error(`Selected variation is no longer available for ${dbProduct.name}`);
        }
      }

      const availableStock = selectedVariant ? selectedVariant.stockQuantity : dbProduct.stockQuantity;
      if (item.quantity > availableStock) {
        throw new Error(
          `Only ${availableStock} unit(s) left for ${dbProduct.name}${selectedVariant ? " (selected variation)" : ""}`
        );
      }

      const price = Number(dbProduct.discountedPrice || dbProduct.price);
      subtotal += price * item.quantity;

      orderItems.push({
        productId: item.productId,
        variantId: selectedVariant?.id,
        quantity: item.quantity,
        price,
        size: item.size,
        color: item.color
      });
    }

    const shippingFee = shippingDetails?.fee ?? DEFAULT_SHIPPING_FEE;
    if (!ALLOWED_SHIPPING_FEES.has(shippingFee)) {
      return NextResponse.json({ error: "Invalid shipping option selected" }, { status: 400 });
    }

    const vatAmount = calculateVatAmount(subtotal);
    const total = calculateTotalWithVat(subtotal, shippingFee);

    const orderNumber = `FAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: session.id,
        subtotal,
        shippingFee,
        vatAmount,
        total,
        status: "PENDING",
        paymentStatus: "UNPAID",
        paymentMethod: "PAYSTACK",
        items: {
          create: orderItems
        }
      }
    });

    await createCustomerNotification({
      customerId: session.id,
      title: `Order ${orderNumber} created`,
      message: "Your order has been created and is waiting for payment confirmation.",
      type: "ORDER",
      link: "/account",
      referenceKey: `order-created-${order.id}`
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      amountInKobo: Math.round(total * 100),
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      paystackPublicKey: getPaystackPublicKey()
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}
