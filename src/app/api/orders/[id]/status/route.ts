import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "ABANDONED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "PARTIALLY_PAID", "REFUNDED"]).optional()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  if (!parsed.data.status && !parsed.data.paymentStatus) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json({ data: order });
  } catch (error) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
