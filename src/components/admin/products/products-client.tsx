"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { Search, Edit2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const productSchema = z.object({
  name: z.string().min(2),
  price: z.coerce.number().positive(),
  stockQuantity: z.coerce.number().int().nonnegative(),
  status: z.enum(["PUBLISHED", "DRAFT", "OUT_OF_STOCK"]).default("DRAFT"),
  collectionId: z.string().optional(),
  newCollection: z.string().optional()
});

type ProductForm = z.infer<typeof productSchema>;

type Collection = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  status: string;
  productType?: string;
  collections?: Collection[];
  images?: string[];
  variants?: { id: string }[];
};

const defaultFilters = {
  status: "all",
  productType: "all",
  collectionId: "all",
  stock: "all",
  minPrice: "",
  maxPrice: ""
};

export function ProductsClient() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: 0, stockQuantity: 0, status: "DRAFT", collectionId: "", newCollection: "" }
  });

  const { data: collectionsData } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const res = await fetch("/api/collections");
      const json = await res.json();
      return json.data as Collection[];
    }
  });

  const { data } = useQuery({
    queryKey: ["products", search, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.productType !== "all") params.set("productType", filters.productType);
      if (filters.collectionId !== "all") params.set("collectionId", filters.collectionId);
      if (filters.stock !== "all") params.set("stock", filters.stock);
      if (filters.minPrice) params.set("minPrice", filters.minPrice);
      if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);

      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      return json as { data: Product[]; total: number };
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: ProductForm) => {
      const payload = {
        name: values.name,
        price: values.price,
        stockQuantity: values.stockQuantity,
        status: values.status,
        collectionIds: values.collectionId ? [values.collectionId] : undefined,
        collectionName: values.newCollection?.trim() || undefined
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["collections"] });
      form.reset();
      setOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to delete product");
      }
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteError(null);
      setProductToDelete(null);
    },
    onError: (error) => {
      setDeleteError(error instanceof Error ? error.message : "Failed to delete product");
    }
  });

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setOpen(true);
    }
  }, [searchParams]);

  const products = data?.data ?? [];
  const total = data?.total ?? products.length;
  const collections = collectionsData ?? [];

  return (
    <div className="space-y-6">
      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm text-forest/70">
            Are you sure you want to delete this product? This action cannot be undone.
          </div>
          {deleteError ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {deleteError}
            </div>
          ) : null}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteError(null);
                setProductToDelete(null);
              }}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-600 text-white hover:bg-rose-700"
              onClick={() => {
                setDeleteError(null);
                if (productToDelete) {
                  deleteMutation.mutate(productToDelete);
                }
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>

          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input {...form.register("name")} placeholder="Palm Silk Set" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Price (NGN)</Label>
                <Input type="number" {...form.register("price")} />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input type="number" {...form.register("stockQuantity")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
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

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="left-auto right-0 top-0 h-full w-full max-w-md translate-x-0 translate-y-0 rounded-l-3xl rounded-r-none p-6">
          <DialogHeader>
            <DialogTitle>Filter Products</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select
                value={filters.productType}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, productType: value }))}
              >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="SIMPLE">Simple</SelectItem>
                  <SelectItem value="VARIABLE">Variable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Collection</Label>
              <Select
                value={filters.collectionId}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, collectionId: value }))}
              >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Select collection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stock</Label>
              <Select
                value={filters.stock}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, stock: value }))}
              >
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Stock level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in">In Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Min Price</Label>
                <Input
                  value={filters.minPrice}
                  onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Max Price</Label>
                <Input
                  value={filters.maxPrice}
                  onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
                  placeholder="500000"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setFilters({ ...defaultFilters })}
            >
              Reset
            </Button>
            <Button onClick={() => setFilterOpen(false)}>Apply Filters</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-forest/60">
          <span className="inline-flex h-10 items-center rounded-full bg-forest/10 px-4 text-xs font-semibold text-forest">
            Showing {products.length} of {total} Products
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-full border-transparent bg-forest/10 text-forest hover:bg-forest/15"
            onClick={() => setFilterOpen(true)}
          >
            Filter
          </Button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/40" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 w-[240px] rounded-full pl-9"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-neutral-50">
            <TableHead className="w-10">
              <input type="checkbox" className="h-4 w-4" />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead>Variations</TableHead>
            <TableHead>In Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <input type="checkbox" className="h-4 w-4" />
              </TableCell>
              <TableCell className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-xl bg-forest/10">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="font-semibold text-forest">{product.name}</div>
              </TableCell>
              <TableCell>{product.collections?.[0]?.name ?? "-"}</TableCell>
              <TableCell>
                {product.productType === "VARIABLE" ? product.variants?.length ?? 0 : 0}
              </TableCell>
              <TableCell>{product.stockQuantity}</TableCell>
              <TableCell>₦{product.price.toLocaleString()}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    product.status === "PUBLISHED"
                      ? "info"
                      : product.status === "OUT_OF_STOCK"
                        ? "warning"
                        : "default"
                  }
                >
                  {product.status.replace("_", " ")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-full border-forest/20 px-3 text-xs font-semibold text-forest/80 hover:bg-forest hover:text-white transition-colors" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit2 className="mr-1.5 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-rose-200 px-3 text-xs font-semibold text-rose-500 hover:border-rose-600 hover:bg-rose-600 hover:text-white transition-colors"
                    onClick={() => {
                      setDeleteError(null);
                      setProductToDelete(product.id);
                    }}
                  >
                    <Trash2 className="mr-1.5 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-forest/60">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select defaultValue="25">
            <SelectTrigger className="h-10 w-[90px] rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span>Entries</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="rounded-full">
            Previous
          </Button>
          <Button size="sm" className="rounded-full">
            1
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            2
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            3
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

