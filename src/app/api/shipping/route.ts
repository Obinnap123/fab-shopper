import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const shippingSchema = z.object({
  locationName: z.string().min(2),
  description: z.string().optional(),
  fee: z.coerce.number().nonnegative().optional(),
  isFree: z.boolean().optional(),
  isPickup: z.boolean().optional()
});

export async function GET() {
  const methods = await prisma.shippingMethod.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ data: methods });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = shippingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const locationName = parsed.data.locationName.trim();
  if (!locationName) {
    return NextResponse.json({ error: "Location name is required" }, { status: 400 });
  }

  const feeValue = parsed.data.isFree ? 0 : parsed.data.fee ?? 0;
  const isFree = parsed.data.isFree ?? feeValue === 0;

  const data = {
    locationName,
    description: parsed.data.description ?? null,
    fee: feeValue,
    isFree,
    isPickup: parsed.data.isPickup ?? false
  };

  const existing = await prisma.shippingMethod.findUnique({
    where: { locationName }
  });

  const method = existing
    ? await prisma.shippingMethod.update({ where: { locationName }, data })
    : await prisma.shippingMethod.create({ data });

  return NextResponse.json(
    { data: method, updated: Boolean(existing) },
    { status: existing ? 200 : 201 }
  );
}
