import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createCustomerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? 20);
  const skip = Number(searchParams.get("skip") ?? 0);

  const customers = await prisma.customer.findMany({
    take,
    skip,
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ data: customers });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createCustomerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const customer = await prisma.customer.create({ data: parsed.data });
  return NextResponse.json({ data: customer }, { status: 201 });
}
