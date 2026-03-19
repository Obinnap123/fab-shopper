import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

const createProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  productType: z.enum(["SIMPLE", "VARIABLE"]).optional(),
  price: z.coerce.number().positive(),
  costPrice: z.coerce.number().nonnegative().optional(),
  discountedPrice: z.coerce.number().nonnegative().optional(),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  unit: z.string().optional(),
  barcode: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "OUT_OF_STOCK"]).optional(),
  images: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
  collectionName: z.string().optional(),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        material: z.string().optional(),
        fitType: z.string().optional(),
        stockQuantity: z.coerce.number().int().nonnegative().default(0),
        price: z.coerce.number().positive().optional(),
        images: z.array(z.string()).optional(),
        sku: z.string().optional()
      })
    )
    .optional()
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const take = Number(limitParam ?? searchParams.get("take") ?? 20);
  const skip = Number(searchParams.get("skip") ?? 0);
  const search = searchParams.get("search")?.trim();
  const status = searchParams.get("status") ?? undefined;
  const productType = searchParams.get("productType") ?? undefined;
  const collectionId = searchParams.get("collectionId") ?? undefined;
  const sort = searchParams.get("sort") ?? "newest";
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const stock = searchParams.get("stock");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } }
    ];
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (productType && productType !== "all") {
    where.productType = productType;
  }

  if (collectionId && collectionId !== "all") {
    where.collections = { some: { id: collectionId } };
  }

  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {})
    };
  }

  if (stock === "in") {
    where.stockQuantity = { gt: 0 };
  }

  if (stock === "out") {
    where.stockQuantity = { lte: 0 };
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      take: Number.isFinite(take) ? take : 20,
      skip,
      where,
      include: { collections: true, variants: true },
      orderBy
    }),
    prisma.product.count({ where })
  ]);

  return NextResponse.json({ data: products, total });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      name,
      slug,
      shortDescription,
      longDescription,
      productType,
      price,
      costPrice,
      discountedPrice,
      stockQuantity,
      unit,
      barcode,
      status,
      images,
      collectionIds,
      collectionName,
      variants
    } = parsed.data;
    const baseSlug = slug ? slugify(slug) : slugify(name);
    let finalSlug = baseSlug;
    let suffix = 1;

    while (await prisma.product.count({ where: { slug: finalSlug } })) {
      suffix += 1;
      finalSlug = `${baseSlug}-${suffix}`;
    }

    const collectionLinks: { id: string }[] = [];

    if (collectionIds?.length) {
      collectionIds.forEach((id) => {
        if (!collectionLinks.some((link) => link.id === id)) {
          collectionLinks.push({ id });
        }
      });
    }

    if (collectionName?.trim()) {
      const trimmedName = collectionName.trim();
      const collectionSlug = slugify(trimmedName);
      let collection = await prisma.collection.findUnique({ where: { slug: collectionSlug } });
      if (!collection) {
        collection = await prisma.collection.create({
          data: {
            name: trimmedName,
            slug: collectionSlug
          }
        });
      }
      if (!collectionLinks.some((link) => link.id === collection.id)) {
        collectionLinks.push({ id: collection.id });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        shortDescription,
        longDescription,
        productType: productType ?? "SIMPLE",
        price,
        costPrice,
        discountedPrice,
        stockQuantity,
        unit,
        barcode,
        status: status ?? "DRAFT",
        images: images ?? [],
        collections: collectionLinks.length ? { connect: collectionLinks } : undefined,
        variants: variants?.length
          ? {
              create: variants.map((variant) => ({
                size: variant.size,
                color: variant.color,
                material: variant.material,
                fitType: variant.fitType,
                stockQuantity: variant.stockQuantity ?? 0,
                price: variant.price,
                images: variant.images ?? [],
                sku: variant.sku
              }))
            }
          : undefined
      }
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    );
  }
}
