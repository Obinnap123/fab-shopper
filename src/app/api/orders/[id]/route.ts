import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateOrderSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "ABANDONED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "PARTIALLY_PAID", "REFUNDED"]).optional()
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { customer: true, items: true }
  });
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: order });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: parsed.data
  });

  return NextResponse.json({ data: order });
}
