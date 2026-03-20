import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive().optional(),
  stockQuantity: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "OUT_OF_STOCK"]).optional(),
  images: z.array(z.string()).optional()
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: product });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data
  });

  return NextResponse.json({ data: product });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
