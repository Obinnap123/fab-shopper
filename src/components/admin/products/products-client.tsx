"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Search } from "lucide-react";

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
  status: z.enum(["PUBLISHED", "DRAFT", "OUT_OF_STOCK"]).default("DRAFT")
});

type ProductForm = z.infer<typeof productSchema>;

type Product = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  status: string;
};

export function ProductsClient() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: 0, stockQuantity: 0, status: "DRAFT" }
  });

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      const json = await res.json();
      return json.data as Product[];
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: ProductForm) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      form.reset();
      setOpen(false);
    }
  });

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setOpen(true);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-forest/60">
          <span className="inline-flex h-10 items-center rounded-full bg-forest/10 px-4 text-xs font-semibold text-forest">
            Showing 25 of {data?.length ?? 0} Products
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 rounded-full border-transparent bg-forest/10 text-forest hover:bg-forest/15"
          >
            Filter
          </Button>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/40" />
            <Input className="h-10 w-[240px] rounded-full pl-9" placeholder="Search" />
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <input type="checkbox" className="h-4 w-4" />
              </TableCell>
              <TableCell className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-forest/10" />
                <div className="font-semibold text-forest">{product.name}</div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>0</TableCell>
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

