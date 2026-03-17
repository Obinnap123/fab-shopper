import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateCustomerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const customer = await prisma.customer.findUnique({ where: { id: params.id } });
  if (!customer) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: customer });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = updateCustomerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const customer = await prisma.customer.update({
    where: { id: params.id },
    data: parsed.data
  });

  return NextResponse.json({ data: customer });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.customer.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
