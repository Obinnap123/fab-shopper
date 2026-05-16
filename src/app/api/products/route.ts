import { NextResponse } from "next/server";
import { isHttpError } from "@/lib/http-error";
import { createProductSchema } from "@/features/catalog/product-schemas";
import { createProduct, listProducts } from "@/features/catalog/product-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const result = await listProducts({
    take: Number(limitParam ?? searchParams.get("take") ?? 20),
    skip: Number(searchParams.get("skip") ?? 0),
    search: searchParams.get("search")?.trim(),
    status: searchParams.get("status"),
    productType: searchParams.get("productType"),
    collectionId: searchParams.get("collectionId"),
    sort: searchParams.get("sort") ?? "newest",
    minPrice: searchParams.get("minPrice"),
    maxPrice: searchParams.get("maxPrice"),
    stock: searchParams.get("stock")
  });

  return NextResponse.json(result);
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

    const product = await createProduct(parsed.data);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: isHttpError(error) ? error.status : 500 }
    );
  }
}
