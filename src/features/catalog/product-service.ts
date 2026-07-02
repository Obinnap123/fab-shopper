import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { HttpError } from "@/lib/http-error";
import type { CreateProductInput, UpdateProductInput } from "@/features/catalog/product-schemas";

const productDetailInclude = {
  collections: true,
  variants: true
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productDetailInclude;
}>;

export function serializeProduct(product: ProductWithRelations) {
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

type ProductListFilters = {
  take: number;
  skip: number;
  search?: string | null;
  status?: string | null;
  productType?: string | null;
  collectionId?: string | null;
  sort?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  stock?: string | null;
};

export async function listProducts(filters: ProductListFilters) {
  const where: Prisma.ProductWhereInput = { deletedAt: null };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { slug: { contains: filters.search, mode: "insensitive" } }
    ];
  }

  if (filters.status && filters.status !== "all") {
    where.status = filters.status as Prisma.EnumProductStatusFilter["equals"];
  }

  if (filters.productType && filters.productType !== "all") {
    where.productType = filters.productType as Prisma.EnumProductTypeFilter["equals"];
  }

  if (filters.collectionId && filters.collectionId !== "all") {
    where.collections = { some: { id: filters.collectionId } };
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: Number(filters.minPrice) } : {}),
      ...(filters.maxPrice ? { lte: Number(filters.maxPrice) } : {})
    };
  }

  if (filters.stock === "in") {
    where.stockQuantity = { gt: 0 };
  }

  if (filters.stock === "out") {
    where.stockQuantity = { lte: 0 };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { price: "asc" }
      : filters.sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      take: Number.isFinite(filters.take) ? filters.take : 20,
      skip: filters.skip,
      where,
      include: productDetailInclude,
      orderBy
    }),
    prisma.product.count({ where })
  ]);

  return {
    data: products.map(serializeProduct),
    total
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: productDetailInclude
  });

  return product ? serializeProduct(product) : null;
}

async function generateUniqueProductSlug(baseValue: string, excludeProductId?: string) {
  const baseSlug = slugify(baseValue);
  let finalSlug = baseSlug;
  let suffix = 1;

  while (
    await prisma.product.count({
      where: {
        slug: finalSlug,
        ...(excludeProductId ? { id: { not: excludeProductId } } : {})
      }
    })
  ) {
    suffix += 1;
    finalSlug = `${baseSlug}-${suffix}`;
  }

  return finalSlug;
}

async function resolveCollectionLinks(collectionIds?: string[], collectionName?: string) {
  const links: { id: string }[] = [];

  if (collectionIds?.length) {
    for (const id of collectionIds) {
      if (!links.some((link) => link.id === id)) {
        links.push({ id });
      }
    }
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

    if (!links.some((link) => link.id === collection.id)) {
      links.push({ id: collection.id });
    }
  }

  return links;
}

export async function createProduct(input: CreateProductInput) {
  const finalSlug = await generateUniqueProductSlug(input.slug || input.name);
  const collectionLinks = await resolveCollectionLinks(input.collectionIds, input.collectionName);

  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: finalSlug,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      productType: input.productType ?? "SIMPLE",
      price: input.price,
      costPrice: input.costPrice,
      discountedPrice: input.discountedPrice,
      stockQuantity: input.stockQuantity,
      unit: input.unit,
      barcode: input.barcode,
      status: input.status ?? "DRAFT",
      images: input.images ?? [],
      collections: collectionLinks.length ? { connect: collectionLinks } : undefined,
      variants: input.variants?.length
        ? {
            create: input.variants.map((variant) => ({
              size: variant.size,
              color: variant.color,
              images: variant.images ?? [],
              sku: variant.sku
            }))
          }
        : undefined
    },
    include: productDetailInclude
  });

  return serializeProduct(product);
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existingProduct = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: productDetailInclude
  });

  if (!existingProduct) {
    throw new HttpError("Product not found", 404);
  }

  const finalSlug =
    input.slug && input.slug !== existingProduct.slug
      ? await generateUniqueProductSlug(input.slug, id)
      : existingProduct.slug;

  const collectionLinks = await resolveCollectionLinks(input.collectionIds, input.collectionName);
  const collectionsToDisconnect = existingProduct.collections
    .map((collection) => collection.id)
    .filter((existingId) => !collectionLinks.some((link) => link.id === existingId));
  const existingVariantIds = input.variants?.flatMap((variant) => (variant.id ? [variant.id] : [])) ?? [];

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      slug: finalSlug,
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      productType: input.productType ?? "SIMPLE",
      price: input.price,
      costPrice: input.costPrice,
      discountedPrice: input.discountedPrice,
      stockQuantity: input.stockQuantity,
      unit: input.unit,
      barcode: input.barcode,
      status: input.status ?? "DRAFT",
      images: input.images ?? [],
      collections: {
        connect: collectionLinks,
        disconnect: collectionsToDisconnect.map((collectionId) => ({ id: collectionId }))
      },
      variants: input.variants?.length || input.productType === "VARIABLE"
        ? {
            deleteMany: {
              id: { notIn: existingVariantIds }
            },
            create: (input.variants ?? [])
              .filter((variant) => !variant.id)
              .map((variant) => ({
                size: variant.size,
                color: variant.color,
                images: variant.images ?? [],
                sku: variant.sku
              })),
            update: (input.variants ?? [])
              .filter((variant) => !!variant.id)
              .map((variant) => ({
                where: { id: variant.id },
                data: {
                  size: variant.size,
                  color: variant.color,
                  images: variant.images ?? [],
                  sku: variant.sku
                }
              }))
          }
        : undefined
    },
    include: productDetailInclude
  });

  return serializeProduct(product);
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      deletedAt: true,
      orderItems: { select: { id: true }, take: 1 }
    }
  });

  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  if (product.deletedAt) {
    return;
  }

  if (product.orderItems.length > 0) {
    await prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: "DRAFT",
        stockQuantity: 0
      }
    });
    return;
  }

  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.productAttribute.deleteMany({ where: { productId: id } }),
    prisma.product.delete({ where: { id } })
  ]);
}
