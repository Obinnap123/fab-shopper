import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { slugify } from "@/lib/slug";

const coerceNumberish = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return value;

  const normalized = value.replace(/[^\d.-]/g, "").trim();
  if (!normalized) return undefined;

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : value;
};

const updateProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  productType: z.enum(["SIMPLE", "VARIABLE"]).optional(),
  price: z.preprocess(coerceNumberish, z.number().positive()),
  costPrice: z.preprocess(coerceNumberish, z.number().nonnegative().optional()),
  discountedPrice: z.preprocess(coerceNumberish, z.number().nonnegative().optional()),
  stockQuantity: z.preprocess(coerceNumberish, z.number().int().nonnegative().default(0)),
  unit: z.string().optional(),
  barcode: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "OUT_OF_STOCK"]).optional(),
  images: z.array(z.string()).optional(),
  collectionIds: z.array(z.string()).optional(),
  collectionName: z.string().optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        material: z.string().optional(),
        fitType: z.string().optional(),
        stockQuantity: z.preprocess(coerceNumberish, z.number().int().nonnegative().default(0)),
        price: z.preprocess(coerceNumberish, z.number().positive().optional()),
        images: z.array(z.string()).optional(),
        sku: z.string().optional()
      })
    )
    .optional()
});

function serializeProduct(
  product: Prisma.ProductGetPayload<{
    include: { collections: true; variants: true };
  }>
) {
  return {
    ...product,
    price: Number(product.price),
    discountedPrice: product.discountedPrice !== null ? Number(product.discountedPrice) : null,
    costPrice: product.costPrice !== null ? Number(product.costPrice) : null,
    variants: product.variants.map((variant) => ({
      ...variant,
      price: variant.price !== null ? Number(variant.price) : null
    }))
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ 
    where: { id },
    include: { collections: true, variants: true }
  });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ data: serializeProduct(product) });
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

  const existingProduct = await prisma.product.findUnique({ where: { id }, include: { collections: true, variants: true } });
  if (!existingProduct) {
     return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  let finalSlug = existingProduct.slug;
  if (slug && slug !== existingProduct.slug) {
     const baseSlug = slugify(slug);
     finalSlug = baseSlug;
     let suffix = 1;
     while (await prisma.product.count({ where: { slug: finalSlug, id: { not: id } } })) {
       suffix += 1;
       finalSlug = `${baseSlug}-${suffix}`;
     }
  }

  const collectionLinks: { id: string }[] = [];

  if (collectionIds?.length) {
    collectionIds.forEach((cId) => {
      if (!collectionLinks.some((link) => link.id === cId)) {
        collectionLinks.push({ id: cId });
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

  const existingCollectionIds = existingProduct.collections.map(c => c.id);
  const collectionsToDisconnect = existingCollectionIds.filter(existingId => !collectionLinks.some(link => link.id === existingId));

  const existingVariantIds = variants?.filter(v => v.id).map(v => v.id as string) || [];

  const updateData: Prisma.ProductUpdateInput = {
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
    collections: {
       connect: collectionLinks,
       disconnect: collectionsToDisconnect.map(cId => ({ id: cId }))
    },
    variants: variants?.length || productType === "VARIABLE" ? {
       deleteMany: {
          id: { notIn: existingVariantIds }
       },
       create: (variants || []).filter(v => !v.id).map(variant => ({
            size: variant.size,
            color: variant.color,
            material: variant.material,
            fitType: variant.fitType,
            stockQuantity: variant.stockQuantity ?? 0,
            price: variant.price,
            images: variant.images ?? [],
            sku: variant.sku
       })),
       update: (variants || []).filter(v => !!v.id).map(variant => ({
          where: { id: variant.id },
          data: {
             size: variant.size,
             color: variant.color,
             material: variant.material,
             fitType: variant.fitType,
             stockQuantity: variant.stockQuantity ?? 0,
             price: variant.price,
             images: variant.images ?? [],
             sku: variant.sku
          }
       }))
    } : undefined
  };

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
    include: { collections: true, variants: true }
  });

  return NextResponse.json({ data: serializeProduct(product) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
