import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getPaystackSecretKey } from "@/lib/paystack";
import { finalizePaystackOrder } from "@/lib/paystack-order";
import { createCustomerNotification } from "@/lib/customer-notifications";

const verifySchema = z.object({
  reference: z.string().min(1),
  orderId: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid verification payload", issues: parsed.error.flatten() }, { status: 400 });
    }

    const { reference, orderId } = parsed.data;

    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`
      }
    });

    const paystackResult = await paystackResponse.json().catch(() => null);
    if (!paystackResponse.ok || !paystackResult?.status) {
      return NextResponse.json(
        { error: paystackResult?.message || "Failed to verify Paystack transaction" },
        { status: 400 }
      );
    }

    const transaction = paystackResult.data;
    if (transaction?.status !== "success") {
      return NextResponse.json({ error: "Transaction is not successful" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: reference },
      include: { customer: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (orderId && order.id !== orderId) {
      return NextResponse.json({ error: "Order reference mismatch" }, { status: 400 });
    }

    const expectedAmount = Math.round(Number(order.total) * 100);
    if (Number(transaction.amount) !== expectedAmount) {
      return NextResponse.json({ error: "Transaction amount mismatch" }, { status: 400 });
    }

    if (transaction.currency && transaction.currency !== "NGN") {
      return NextResponse.json({ error: "Transaction currency mismatch" }, { status: 400 });
    }

    const result = await finalizePaystackOrder(reference, transaction.id?.toString());

    if (result.finalized) {
      await (prisma as any).notification.create({
        data: {
          title: `Payment confirmed for Order #${reference}`,
          message: `Payment for order ${reference} has been verified successfully.`,
          type: "ORDER",
          link: `/admin/orders?id=${order.id}`
        }
      });

      await createCustomerNotification({
        customerId: order.customerId,
        title: `Payment confirmed for ${reference}`,
        message: "We have confirmed your Paystack payment and your order is now being prepared.",
        type: "PAYMENT",
        link: `/order-confirmation/${order.id}`,
        referenceKey: `payment-confirmed-${reference}`
      });
    }

    return NextResponse.json({
      verified: true,
      finalized: result.finalized,
      alreadyProcessed: result.alreadyProcessed,
      orderId: order.id,
      reference,
      paymentStatus: result.finalized || result.alreadyProcessed ? "PAID" : order.paymentStatus
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to verify Paystack transaction" },
      { status: 500 }
    );
  }
}
