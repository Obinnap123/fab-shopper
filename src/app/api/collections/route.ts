import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const collectionSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  image: z.string().optional()
});

export async function GET() {
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return NextResponse.json({ data: collections });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = collectionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { name, slug, image } = parsed.data;
  const finalSlug = slug ? slugify(slug) : slugify(name);

  const collection = await prisma.collection.create({
    data: {
      name,
      slug: finalSlug,
      image
    }
  });

  return NextResponse.json({ data: collection }, { status: 201 });
}
