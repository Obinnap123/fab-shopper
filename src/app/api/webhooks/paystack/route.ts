import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { finalizePaystackOrder } from "@/lib/paystack-order";
import { createCustomerNotification } from "@/lib/customer-notifications";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

    if (!secret) {
      console.warn("Paystack webhook secret is not configured. Skipping webhook verification in this environment.");
      return NextResponse.json({ status: "ignored" });
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      if (reference) {
        const result = await finalizePaystackOrder(reference, event.data.id?.toString());

        if ("reason" in result && result.reason === "insufficient_stock") {
          await (prisma as any).notification.create({
            data: {
              title: `Stock issue after payment for Order #${reference}`,
              message: `Payment was confirmed by webhook for ${reference}, but stock could not be decremented automatically. Manual review is required.`,
              type: "ORDER",
              link: `/admin/orders?id=${result.orderId}`
            }
          });
        }

        if (result.finalized) {
          await (prisma as any).notification.create({
            data: {
              title: `Payment confirmed for Order #${reference}`,
              message: `Payment for order ${reference} has been verified successfully.`,
              type: "ORDER",
              link: `/admin/orders?id=${result.orderId}`
            }
          });

          const order = await prisma.order.findUnique({
            where: { id: result.orderId },
            select: { customerId: true, orderNumber: true }
          });

          if (order) {
            await createCustomerNotification({
              customerId: order.customerId,
              title: `Payment confirmed for ${order.orderNumber}`,
              message: "Your payment has been received successfully. We will keep you posted as your order moves forward.",
              type: "PAYMENT",
              link: `/order-confirmation/${result.orderId}`,
              referenceKey: `payment-confirmed-${order.orderNumber}`
            });
          }
        }
      }
    }

    if (event.event === "charge.failed" || event.event === "charge.abandoned") {
      const reference = event.data?.reference;
      if (reference) {
        await prisma.order.updateMany({
          where: { orderNumber: reference, paymentStatus: "UNPAID" },
          data: { status: "ABANDONED" }
        });
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
