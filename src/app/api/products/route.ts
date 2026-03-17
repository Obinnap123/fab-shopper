import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive(),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["PUBLISHED", "DRAFT", "OUT_OF_STOCK"]).optional(),
  images: z.array(z.string()).optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const take = Number(searchParams.get("take") ?? 20);
  const skip = Number(searchParams.get("skip") ?? 0);

  const products = await prisma.product.findMany({
    take,
    skip,
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ data: products });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { name, slug, shortDescription, price, stockQuantity, status, images } = parsed.data;
  const finalSlug = slug ? slugify(slug) : slugify(name);

  const product = await prisma.product.create({
    data: {
      name,
      slug: finalSlug,
      shortDescription,
      price,
      stockQuantity,
      status: status ?? "DRAFT",
      images: images ?? []
    }
  });

  return NextResponse.json({ data: product }, { status: 201 });
}
