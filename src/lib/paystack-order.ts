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
      reason: "insufficient_stock";
      orderId: string;
      orderNumber: string;
      message: string;
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
      const productUpdated = await tx.product.updateMany({
        where: {
          id: item.productId,
          stockQuantity: { gte: item.quantity }
        },
        data: {
          stockQuantity: { decrement: item.quantity }
        }
      });

      if (productUpdated.count === 0) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      if (item.variantId) {
        const variantUpdated = await tx.productVariant.updateMany({
          where: {
            id: item.variantId,
            stockQuantity: { gte: item.quantity }
          },
          data: {
            stockQuantity: { decrement: item.quantity }
          }
        });

        if (variantUpdated.count === 0) {
          throw new Error(`Insufficient stock for variant ${item.variantId}`);
        }
      }
    }

    return true;
  }).catch((error: Error) => {
    if (error.message.startsWith("Insufficient stock")) {
      return "insufficient_stock" as const;
    }

    throw error;
  });

  if (finalized === "insufficient_stock") {
    return {
      finalized: false,
      alreadyProcessed: false,
      reason: "insufficient_stock",
      orderId: order.id,
      orderNumber: order.orderNumber,
      message:
        "Payment was received, but we couldn't confirm stock for every item automatically. Please contact support so we can resolve your order."
    };
  }

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
