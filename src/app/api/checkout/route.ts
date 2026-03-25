import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/customer-auth";
import { getPaystackSecretKey } from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingDetails } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total from DB to prevent tampering
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (!dbProduct) throw new Error(`Product ${item.productId} not found`);

      const price = Number(dbProduct.discountedPrice || dbProduct.price);
      subtotal += price * item.quantity;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        size: item.size,
        color: item.color
      });
    }

    // Handle Shipping fee (mocking based on UI selection or fixed for now)
    const shippingFee = shippingDetails?.fee || 4500;
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
