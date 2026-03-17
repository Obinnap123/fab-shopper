"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orderSchema = z.object({
  customerId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce.number().positive(),
  shippingFee: z.coerce.number().nonnegative().default(0),
  vatAmount: z.coerce.number().nonnegative().default(0)
});

type OrderForm = z.infer<typeof orderSchema>;

type Customer = { id: string; firstName: string; lastName: string };

type Product = { id: string; name: string };

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
};

export function OrdersClient() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1, price: 0, shippingFee: 0, vatAmount: 0 }
  });

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      const json = await res.json();
      return json.data as Order[];
    }
  });

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch("/api/customers");
      const json = await res.json();
      return json.data as Customer[];
    }
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      const json = await res.json();
      return json.data as Product[];
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: OrderForm) => {
      const subtotal = values.quantity * values.price;
      const total = subtotal + values.shippingFee + values.vatAmount;
      const payload = {
        customerId: values.customerId,
        items: [
          {
            productId: values.productId,
            quantity: values.quantity,
            price: values.price
          }
        ],
        subtotal,
        shippingFee: values.shippingFee,
        vatAmount: values.vatAmount,
        total
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
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
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Manual Order</DialogTitle>
            </DialogHeader>

            <form
              className="mt-6 space-y-4"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="space-y-2">
                <Label>Customer</Label>
                <Controller
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {(customers ?? []).map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Product</Label>
                <Controller
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {(products ?? []).map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" {...form.register("quantity")} />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price (NGN)</Label>
                  <Input type="number" {...form.register("price")} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Shipping Fee</Label>
                  <Input type="number" {...form.register("shippingFee")} />
                </div>
                <div className="space-y-2">
                  <Label>VAT Amount</Label>
                  <Input type="number" {...form.register("vatAmount")} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Create Order"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(orders ?? []).map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-semibold text-forest">{order.orderNumber}</TableCell>
              <TableCell>?{order.total.toLocaleString()}</TableCell>
              <TableCell>
                <Badge variant={order.status === "COMPLETED" ? "success" : "warning"}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
