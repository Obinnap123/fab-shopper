import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getPaystackWebhookSecret } from "@/lib/paystack";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    const secret = getPaystackWebhookSecret();

    if (!signature || !secret) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const order = await prisma.order.findUnique({
        where: { orderNumber: reference },
        include: { items: true }
      });

      if (order && order.paymentStatus !== "PAID") {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "PAID",
              paystackRef: event.data.id?.toString(),
              status: "PROCESSING"
            }
          });

          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: { decrement: item.quantity }
              }
            });

            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                  stockQuantity: { decrement: item.quantity }
                }
              });
            }
          }
        });
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
