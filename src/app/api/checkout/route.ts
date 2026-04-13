import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customer-auth";
import { getPaystackSecretKey } from "@/lib/paystack";
import { ALLOWED_SHIPPING_FEES, DEFAULT_SHIPPING_FEE } from "@/lib/shipping-options";

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

    // Calculate total from DB to prevent tampering
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
      if (!dbProduct) throw new Error(`Product ${item.productId} not found`);

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

    // Allow only known shipping fee options to prevent payload tampering
    const shippingFee = shippingDetails?.fee ?? DEFAULT_SHIPPING_FEE;
    if (!ALLOWED_SHIPPING_FEES.has(shippingFee)) {
      return NextResponse.json({ error: "Invalid shipping option selected" }, { status: 400 });
    }
    const total = subtotal + shippingFee;

    // Generate Order Number
    const orderNumber = `FAB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: session.id,
        subtotal,
        shippingFee,
        total,
        status: "PENDING",
        paymentStatus: "UNPAID",
        paymentMethod: "PAYSTACK",
        items: {
          create: orderItems
        }
      }
    });

    // Generate Notification for the Admin Dashboard
    // Typecast to any locally to suppress TS error since Prisma lock prevented local type generation
    await (prisma as any).notification.create({
      data: {
        title: `You have a New Order #${orderNumber.split('-').pop()}`,
        message: `${session.firstName} ${session.lastName} purchased ${items.length} items worth ₦${total.toLocaleString()} from your website.`,
        type: "ORDER",
        link: `/admin/orders?id=${order.id}`
      }
    });

    // Initialize Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: session.email,
        amount: Math.round(total * 100), // convert to kobo
        reference: orderNumber,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/order-confirmation/${order.id}`,
        metadata: {
          orderId: order.id,
          customerId: session.id
        }
      })
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize Paystack");
    }

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process checkout" },
      { status: 500 }
    );
  }
}
