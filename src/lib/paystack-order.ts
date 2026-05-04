import { prisma } from "@/lib/prisma";

type FinalizeResult =
  | {
      finalized: true;
      alreadyProcessed: false;
      orderId: string;
      orderNumber: string;
    }
  | {
      finalized: false;
      alreadyProcessed: true;
      orderId: string;
      orderNumber: string;
    }
  | {
      finalized: false;
      alreadyProcessed: false;
      reason: "not_found";
    };

export async function finalizePaystackOrder(reference: string, paystackRef?: string): Promise<FinalizeResult> {
  const order = await prisma.order.findUnique({
    where: { orderNumber: reference },
    include: { items: true }
  });

  if (!order) {
    return { finalized: false, alreadyProcessed: false, reason: "not_found" };
  }

  const finalized = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: "UNPAID"
      },
      data: {
        paymentStatus: "PAID",
        paystackRef: paystackRef ?? order.paystackRef,
        status: "PROCESSING"
      }
    });

    if (updated.count === 0) {
      return false;
    }

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

    return true;
  });

  if (!finalized) {
    return {
      finalized: false,
      alreadyProcessed: true,
      orderId: order.id,
      orderNumber: order.orderNumber
    };
  }

  return {
    finalized: true,
    alreadyProcessed: false,
    orderId: order.id,
    orderNumber: order.orderNumber
  };
}
