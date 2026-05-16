import { z } from "zod";

export const coerceNumberish = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return value;

  const normalized = value.replace(/[^\d.-]/g, "").trim();
  if (!normalized) return undefined;

  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : value;
};

const baseProductSchema = {
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
  collectionName: z.string().optional()
} as const;

export const createProductSchema = z.object({
  ...baseProductSchema,
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        images: z.array(z.string()).optional(),
        sku: z.string().optional()
      })
    )
    .optional()
});

export const updateProductSchema = z.object({
  ...baseProductSchema,
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        images: z.array(z.string()).optional(),
        sku: z.string().optional()
      })
    )
    .optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
