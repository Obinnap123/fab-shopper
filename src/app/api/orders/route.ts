import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive()
});

const createOrderSchema = z.object({
  customerId: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
  shippingFee: z.coerce.number().nonnegative().default(0),
  vatAmount: z.coerce.number().nonnegative().default(0),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "ABANDONED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "PARTIALLY_PAID", "REFUNDED"]).optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? 20);
  const skip = Number(searchParams.get("skip") ?? 0);
  const search = searchParams.get("search")?.trim();
  const dateRange = searchParams.get("dateRange") ?? "this-month";
  const delivery = searchParams.get("delivery") ?? "all";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { customer: { firstName: { contains: search, mode: "insensitive" } } },
      { customer: { lastName: { contains: search, mode: "insensitive" } } }
    ];
  }

  if (delivery === "delivery") {
    where.shippingFee = { gt: 0 };
  }

  if (delivery === "pickup") {
    where.shippingFee = { lte: 0 };
  }

  const now = new Date();
  let start: Date | null = null;
  let end: Date | null = null;

  if (dateRange === "this-month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  } else if (dateRange === "last-month") {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (dateRange === "last-3") {
    start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  if (start && end) {
    where.createdAt = { gte: start, lt: end };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      take,
      skip,
      where,
      orderBy: { createdAt: "desc" },
      include: { customer: true, items: true }
    }),
    prisma.order.count({ where })
  ]);

  return NextResponse.json({ data: orders, total });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  let subtotal = 0;
  const normalizedItems: { productId: string; quantity: number; price: number }[] = [];

  for (const item of parsed.data.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product) {
      return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
    }

    if (item.quantity > product.stockQuantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}` },
        { status: 409 }
      );
    }

    const price = Number(product.discountedPrice ?? product.price);
    subtotal += price * item.quantity;
    normalizedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      price
    });
  }

  const total = subtotal + parsed.data.shippingFee + parsed.data.vatAmount;
  const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: parsed.data.customerId,
      subtotal,
      shippingFee: parsed.data.shippingFee,
      vatAmount: parsed.data.vatAmount,
      total,
      status: parsed.data.status ?? "PENDING",
      paymentStatus: parsed.data.paymentStatus ?? "UNPAID",
      items: {
        create: normalizedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });

  return NextResponse.json({ data: order }, { status: 201 });
}
