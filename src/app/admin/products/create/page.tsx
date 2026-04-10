"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Trash2, UploadCloud } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const productSchema = z.object({
  productType: z.enum(["SIMPLE", "VARIABLE"]).default("SIMPLE"),
  name: z.string().min(2, "Product name is required"),
  slug: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  costPrice: z.string().optional(),
  discountedPrice: z.string().optional(),
  stockQuantity: z.string().min(1, "Stock quantity is required"),
  unit: z.string().optional(),
  barcode: z.string().optional(),
  status: z.enum(["PUBLISHED", "DRAFT", "OUT_OF_STOCK"]).default("DRAFT"),
  collectionId: z.string().optional(),
  newCollection: z.string().optional(),
  images: z.array(z.string()).default([]),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        material: z.string().optional(),
        fitType: z.string().optional(),
        stockQuantity: z.string().min(1, "Stock is required"),
        price: z.string().optional()
      })
    )
    .default([])
});

type ProductForm = z.infer<typeof productSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-rose-500">{message}</p>;
}

const parseNumberish = (value?: string) => {
  if (!value) return undefined;
  const normalized = value.replace(/[^\d.-]/g, "").trim();
  if (!normalized) return undefined;
  const num = Number(normalized);
  return Number.isFinite(num) ? num : undefined;
};

export default function CreateProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<ProductForm | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productType: "SIMPLE",
      name: "",
      slug: "",
      shortDescription: "",
      longDescription: "",
      price: "",
      costPrice: "",
      discountedPrice: "",
      stockQuantity: "",
      unit: "pc",
      barcode: "",
      status: "DRAFT",
      collectionId: "",
      newCollection: "",
      images: [],
      variants: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants"
  });

  const { data: collectionsData } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      const json = await res.json();
      return json.data as Array<{ id: string; name: string }>;
    }
  });

  const collections = collectionsData ?? [];

  useEffect(() => {
    form.setValue("images", images, { shouldValidate: true });
  }, [images, form]);

  const handleUpload = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (!files.length) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to upload images");
      }

      const payload = await response.json();
      const uploadedUrls = (payload?.data ?? []).map((item: { url: string }) => item.url);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploading) return;
    handleUpload(event.dataTransfer.files);
  };

  const handlePreview = form.handleSubmit((values) => {
    setPreviewData(values);
    setPreviewOpen(true);
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null);
    const parsedPrice = parseNumberish(values.price);
    const parsedStock = parseNumberish(values.stockQuantity);

    if (parsedPrice === undefined || parsedStock === undefined) {
      setErrorMessage("Please enter valid numeric values for price and stock quantity.");
      return;
    }

    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      shortDescription: values.shortDescription || undefined,
      longDescription: values.longDescription || undefined,
      productType: values.productType,
      price: parsedPrice,
      costPrice: parseNumberish(values.costPrice),
      discountedPrice: parseNumberish(values.discountedPrice),
      stockQuantity: parsedStock,
      unit: values.unit || undefined,
      barcode: values.barcode || undefined,
      status: values.status,
      collectionIds: values.collectionId ? [values.collectionId] : undefined,
      collectionName: values.newCollection?.trim() || undefined,
      images,
      variants:
        values.productType === "VARIABLE"
          ? values.variants.map((variant) => ({
              size: variant.size || undefined,
              color: variant.color || undefined,
              material: variant.material || undefined,
              fitType: variant.fitType || undefined,
              stockQuantity: parseNumberish(variant.stockQuantity) ?? 0,
              price: parseNumberish(variant.price)
            }))
          : []
    };

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const raw = await response.text().catch(() => "");
      let payload: { error?: string; issues?: { fieldErrors?: Record<string, string[]> } } | null = null;
      try {
        payload = raw ? JSON.parse(raw) : null;
      } catch {
        payload = null;
      }

      const fieldIssues = payload?.issues?.fieldErrors
        ? Object.entries(payload.issues.fieldErrors)
            .filter(([, messages]) => messages?.length)
            .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
            .join(" | ")
        : "";

      setErrorMessage(payload?.error ? `${payload.error}${fieldIssues ? ` (${fieldIssues})` : ""}` : raw || "Failed to create product");
      return;
    }

    form.reset();
    setImages([]);
    router.push("/admin/products");
  });

  const productType = form.watch("productType");

  return (
    <AdminShell>
      <form onSubmit={onSubmit} className="space-y-6">
        <PageHeader
          eyebrow="Products"
          title="Create Product"
          subtitle="Add a new product or variation-rich item to the Fab Shopper store."
          actions={
            <Button asChild variant="outline" className="rounded-full border-forest/30 text-forest">
              <Link href="/admin/products">
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          }
        />

        <SectionCard title="Product Type" subtitle="Choose if this product has variations.">
          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => form.setValue("productType", "SIMPLE")}
              className={`rounded-2xl border p-5 text-left shadow-sm transition ${
                productType === "SIMPLE"
                  ? "border-forest bg-forest/5"
                  : "border-forest/20 hover:border-forest/40"
              }`}
            >
              <p className="font-semibold text-forest">Regular Product</p>
              <p className="mt-2 text-sm text-forest/60">Single SKU, no variations.</p>
            </button>
            <button
              type="button"
              onClick={() => form.setValue("productType", "VARIABLE")}
              className={`rounded-2xl border p-5 text-left shadow-sm transition ${
                productType === "VARIABLE"
                  ? "border-forest bg-forest/5"
                  : "border-forest/20 hover:border-forest/40"
              }`}
            >
              <p className="font-semibold text-forest">Product with Variations</p>
              <p className="mt-2 text-sm text-forest/60">Sizes, colors, materials, and more.</p>
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Product Details" subtitle="Core product information and media.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input {...form.register("name")} placeholder="Palm Silk Set" />
              <FieldError message={form.formState.errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Label>Slug (optional)</Label>
              <Input {...form.register("slug")} placeholder="palm-silk-set" />
            </div>
            <div className="space-y-2">
              <Label>Collection</Label>
              <Select
                value={form.watch("collectionId") || "none"}
                onValueChange={(value) => form.setValue("collectionId", value === "none" ? "" : value)}
              >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No collection</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Create New Collection (optional)</Label>
              <Input {...form.register("newCollection")} placeholder="Zara 1" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Short Description</Label>
              <Textarea {...form.register("shortDescription")} placeholder="Short product description..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Long Description</Label>
              <Textarea
                {...form.register("longDescription")}
                className="min-h-[160px]"
                placeholder="Detailed product description..."
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Product Images</Label>
              <div
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
                className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-forest/30 bg-forest/5 p-6 text-center text-sm text-forest/60"
              >
                <UploadCloud className="h-6 w-6 text-forest/50" />
                <p>Drag & drop product images here</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Images"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files) {
                      handleUpload(event.target.files);
                      event.target.value = "";
                    }
                  }}
                />
                {isUploading ? (
                  <span className="inline-flex items-center gap-2 text-xs text-forest/60">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading images...
                  </span>
                ) : null}
              </div>
              {images.length ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {images.map((url) => (
                    <div key={url} className="group relative overflow-hidden rounded-2xl border border-forest/10">
                      <img src={url} alt="Product" className="h-32 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((img) => img !== url))}
                        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-forest shadow-sm transition hover:bg-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Pricing & Inventory" subtitle="Set pricing and stock levels.">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Price (₦)</Label>
              <Input type="number" inputMode="decimal" {...form.register("price")} placeholder="25000" />
              <FieldError message={form.formState.errors.price?.message} />
            </div>
            <div className="space-y-2">
              <Label>Cost Price (₦)</Label>
              <Input type="number" inputMode="decimal" {...form.register("costPrice")} placeholder="15000" />
            </div>
            <div className="space-y-2">
              <Label>Discounted Price (₦)</Label>
              <Input type="number" inputMode="decimal" {...form.register("discountedPrice")} placeholder="20000" />
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input type="number" inputMode="numeric" {...form.register("stockQuantity")} placeholder="0" />
              <FieldError message={form.formState.errors.stockQuantity?.message} />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input {...form.register("unit")} placeholder="pc" />
            </div>
            <div className="space-y-2">
              <Label>Barcode</Label>
              <Input {...form.register("barcode")} placeholder="Optional barcode" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 rounded-2xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </SectionCard>

        {productType === "VARIABLE" ? (
          <SectionCard title="Variations" subtitle="Add the variations for this product.">
            <div className="space-y-4">
              {fields.length ? (
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-3 rounded-2xl border border-forest/10 p-4 md:grid-cols-6"
                  >
                    <div className="space-y-2 md:col-span-1">
                      <Label>Size</Label>
                      <Input {...form.register(`variants.${index}.size`)} placeholder="M" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label>Color</Label>
                      <Input {...form.register(`variants.${index}.color`)} placeholder="Black" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label>Material</Label>
                      <Input {...form.register(`variants.${index}.material`)} placeholder="Silk" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label>Fit Type</Label>
                      <Input {...form.register(`variants.${index}.fitType`)} placeholder="Slim" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        inputMode="numeric"
                        {...form.register(`variants.${index}.stockQuantity`)}
                        placeholder="0"
                      />
                      <FieldError
                        message={form.formState.errors.variants?.[index]?.stockQuantity?.message}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label>Price (₦)</Label>
                      <Input type="number" inputMode="decimal" {...form.register(`variants.${index}.price`)} placeholder="25000" />
                    </div>
                    <div className="md:col-span-6 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-forest/60">
                  No variations yet. Add size/color combinations below.
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                className="rounded-full border-forest/30 text-forest"
                onClick={() =>
                  append({
                    size: "",
                    color: "",
                    material: "",
                    fitType: "",
                    stockQuantity: "0",
                    price: ""
                  })
                }
              >
                Add Variation
              </Button>
            </div>
          </SectionCard>
        ) : null}
        {errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {errorMessage}
          </div>
        ) : null}

        <div className="-mx-6 mt-8 -mb-10 border-t border-forest/20 bg-forest px-6 py-4 shadow-[0_-12px_30px_rgba(15,32,25,0.35)] md:-mx-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-cream/60 bg-transparent text-cream hover:bg-white/15"
                onClick={() => form.reset()}
              >
                Clear Fields
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-cream/60 bg-transparent text-cream hover:bg-white/15"
                onClick={() => router.push("/admin/products")}
              >
                Cancel
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-cream/60 bg-transparent text-cream hover:bg-white/15"
                onClick={handlePreview}
              >
                Preview
              </Button>
              <Button
                type="submit"
                className="rounded-full bg-cream text-forest font-semibold hover:bg-cream/90"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Preview</DialogTitle>
          </DialogHeader>
          {previewData ? (
            <div className="space-y-4 text-sm text-forest/70">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/50">Name</p>
                <p className="text-base font-semibold text-forest">{previewData.name}</p>
              </div>
              {previewData.shortDescription ? <p>{previewData.shortDescription}</p> : null}
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-forest/50">Price</p>
                  <p className="font-semibold text-forest">₦{previewData.price}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-forest/50">Stock</p>
                  <p className="font-semibold text-forest">{previewData.stockQuantity}</p>
                </div>
              </div>
              {images.length ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {images.map((url) => (
                    <img key={url} src={url} alt="Preview" className="h-24 w-full rounded-xl object-cover" />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}





