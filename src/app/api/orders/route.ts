import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().positive()
});

const createOrderSchema = z.object({
  customerId: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  subtotal: z.coerce.number().nonnegative(),
  shippingFee: z.coerce.number().nonnegative().default(0),
  vatAmount: z.coerce.number().nonnegative().default(0),
  total: z.coerce.number().nonnegative(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "ABANDONED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "PARTIALLY_PAID", "REFUNDED"]).optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? 20);
  const skip = Number(searchParams.get("skip") ?? 0);

  const orders = await prisma.order.findMany({
    take,
    skip,
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true }
  });

  return NextResponse.json({ data: orders });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const orderCount = await prisma.order.count();
  const orderNumber = `ORD-${String(orderCount + 1).padStart(5, "0")}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: parsed.data.customerId,
      subtotal: parsed.data.subtotal,
      shippingFee: parsed.data.shippingFee,
      vatAmount: parsed.data.vatAmount,
      total: parsed.data.total,
      status: parsed.data.status ?? "PENDING",
      paymentStatus: parsed.data.paymentStatus ?? "UNPAID",
      items: {
        create: parsed.data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });

  return NextResponse.json({ data: order }, { status: 201 });
}
