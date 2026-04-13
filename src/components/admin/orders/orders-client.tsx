"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Filter, PackageSearch, RefreshCw, Search, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

const statusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED", "ABANDONED"]),
  paymentStatus: z.enum(["UNPAID", "PAID", "PARTIALLY_PAID", "REFUNDED"])
});

type StatusForm = z.infer<typeof statusSchema>;

type Customer = { id: string; firstName: string; lastName: string };
type Product = { id: string; name: string };

type Order = {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  shippingFee: number;
  createdAt: string;
  customer?: Customer | null;
};

const statusBadge = (status: string) => {
  if (status === "COMPLETED") return "success";
  if (status === "SHIPPED") return "info";
  if (status === "CANCELLED") return "danger";
  return "warning";
};

export function OrdersClient() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("this-month");
  const [deliveryFilter, setDeliveryFilter] = useState<"all" | "delivery" | "pickup">("all");
  const [customerQuery, setCustomerQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [autoVat, setAutoVat] = useState(true);
  const [vatRate, setVatRate] = useState(7.5);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: { quantity: 1, price: 0, shippingFee: 0, vatAmount: 0 }
  });

  const statusForm = useForm<StatusForm>({
    resolver: zodResolver(statusSchema),
    defaultValues: { orderId: "", status: "PENDING", paymentStatus: "UNPAID" }
  });

  const { data: ordersData } = useQuery({
    queryKey: ["orders", search, dateRange, deliveryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (dateRange) params.set("dateRange", dateRange);
      if (deliveryFilter !== "all") params.set("delivery", deliveryFilter);
      const res = await fetch(`/api/orders?${params.toString()}`);
      const json = await res.json();
      return json as { data: Order[]; total: number };
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
      setCustomerQuery("");
      setProductQuery("");
      setOpen(false);
      router.refresh();
    }
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (payload: { firstName: string; lastName: string }) => {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create customer");
      const json = await res.json();
      return json.data as Customer;
    },
    onSuccess: (customer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      form.setValue("customerId", customer.id, { shouldValidate: true });
      setCustomerQuery(`${customer.firstName} ${customer.lastName}`);
      setCustomerOpen(false);
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (payload: { name: string; price: number }) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to create product");
      const json = await res.json();
      return json.data as Product;
    },
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.setValue("productId", product.id, { shouldValidate: true });
      setProductQuery(product.name);
      setProductOpen(false);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (values: StatusForm) => {
      if (!values.orderId) throw new Error("Missing order id");
      const res = await fetch(`/api/orders/${values.orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error ?? "Failed to update order");
      }
      return json;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      router.refresh();
      setStatusOpen(false);
      setStatusError(null);
      statusForm.reset({ orderId: "", status: "PENDING", paymentStatus: "UNPAID" });
    },
    onError: (error) => {
      setStatusError(error instanceof Error ? error.message : "Failed to update order");
    }
  });

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-order-modal", handler);
    return () => window.removeEventListener("open-order-modal", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setSubmitError(null);
    }
  }, [open]);

  const quantity = form.watch("quantity");
  const price = form.watch("price");

  useEffect(() => {
    if (!autoVat) return;
    const subtotal = (Number(quantity) || 0) * (Number(price) || 0);
    const vatValue = Number((subtotal * (vatRate / 100)).toFixed(2));
    form.setValue("vatAmount", vatValue, { shouldValidate: true, shouldDirty: true });
  }, [autoVat, vatRate, quantity, price, form]);

  const orders = ordersData?.data ?? [];
  const total = ordersData?.total ?? orders.length;
  const filteredOrders = useMemo(() => orders, [orders]);

  const filteredCustomers =
    (customers ?? []).filter((customer) =>
      `${customer.firstName} ${customer.lastName}`
        .toLowerCase()
        .includes(customerQuery.toLowerCase())
    );

  const filteredProducts =
    (products ?? []).filter((product) =>
      product.name.toLowerCase().includes(productQuery.toLowerCase())
    );

  const canQuickCreateCustomer =
    customerQuery.trim().split(/\s+/).filter(Boolean).length >= 2;
  const canQuickCreateProduct = productQuery.trim().length > 1 && Number(price) > 0;

  return (
    <div className="space-y-6">
      <Dialog
        open={statusOpen}
        onOpenChange={(value) => {
          setStatusOpen(value);
          if (!value) {
            setStatusError(null);
            statusForm.reset({ orderId: "", status: "PENDING", paymentStatus: "UNPAID" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <form
            className="mt-4 space-y-4"
            onSubmit={statusForm.handleSubmit((values) => updateStatusMutation.mutate(values))}
          >
            {statusError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                {statusError}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={statusForm.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="ABANDONED">Abandoned</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Controller
                control={statusForm.control}
                name="paymentStatus"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-10 rounded-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStatusOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateStatusMutation.isPending}>
                {updateStatusMutation.isPending ? "Saving..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Manual Order</DialogTitle>
          </DialogHeader>

          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit((values) => {
              setSubmitError(null);
              mutation.mutate(values, {
                onError: (error) => {
                  setSubmitError(error instanceof Error ? error.message : "Failed to create order");
                }
              });
            })}
          >
            {Object.keys(form.formState.errors).length ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                Please complete the required fields before creating the order.
              </div>
            ) : null}
            <div className="space-y-2">
              <Label>Customer</Label>
              <Controller
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      value={customerQuery}
                      onChange={(event) => {
                        setCustomerQuery(event.target.value);
                        setCustomerOpen(true);
                        if (field.value) {
                          field.onChange("");
                        }
                      }}
                      onFocus={() => setCustomerOpen(true)}
                      onBlur={() => setTimeout(() => setCustomerOpen(false), 120)}
                      placeholder="Search or select customer"
                    />
                    {form.formState.errors.customerId ? (
                      <p className="mt-2 text-xs text-rose-600">Select a customer to continue.</p>
                    ) : (
                      <p className="mt-2 text-xs text-forest/50">Type to search, then pick a customer.</p>
                    )}
                    {customerOpen ? (
                      <div className="absolute z-[80] mt-2 w-full rounded-2xl border border-forest/15 bg-white p-2 shadow-lg">
                        {filteredCustomers.length ? (
                          filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              type="button"
                              className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-forest hover:bg-forest/5"
                              onMouseDown={() => {
                                field.onChange(customer.id);
                                setCustomerQuery(`${customer.firstName} ${customer.lastName}`);
                                setCustomerOpen(false);
                              }}
                            >
                              {customer.firstName} {customer.lastName}
                            </button>
                          ))
                        ) : (
                          <div className="flex flex-col gap-2 p-2 text-xs text-forest/60">
                            <span>No customers yet.</span>
                            {canQuickCreateCustomer ? (
                              <button
                                type="button"
                                className="rounded-full border border-forest/20 px-3 py-1 text-forest hover:bg-forest/5"
                                onMouseDown={() => {
                                  const [firstName, ...rest] = customerQuery.trim().split(/\s+/);
                                  const lastName = rest.join(" ");
                                  createCustomerMutation.mutate({ firstName, lastName });
                                }}
                              >
                                Create "{customerQuery.trim()}"
                              </button>
                            ) : (
                              <span className="text-[11px] text-forest/50">
                                Type first and last name to create.
                              </span>
                            )}
                            <Link className="text-forest underline" href="/admin/customers">
                              Add a customer
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Product</Label>
              <Controller
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      value={productQuery}
                      onChange={(event) => {
                        setProductQuery(event.target.value);
                        setProductOpen(true);
                        if (field.value) {
                          field.onChange("");
                        }
                      }}
                      onFocus={() => setProductOpen(true)}
                      onBlur={() => setTimeout(() => setProductOpen(false), 120)}
                      placeholder="Search or select product"
                    />
                    {form.formState.errors.productId ? (
                      <p className="mt-2 text-xs text-rose-600">Select a product to continue.</p>
                    ) : (
                      <p className="mt-2 text-xs text-forest/50">Type to search, then pick a product.</p>
                    )}
                    {productOpen ? (
                      <div className="absolute z-[80] mt-2 w-full rounded-2xl border border-forest/15 bg-white p-2 shadow-lg">
                        {filteredProducts.length ? (
                          filteredProducts.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-forest hover:bg-forest/5"
                              onMouseDown={() => {
                                field.onChange(product.id);
                                setProductQuery(product.name);
                                setProductOpen(false);
                              }}
                            >
                              {product.name}
                            </button>
                          ))
                        ) : (
                          <div className="flex flex-col gap-2 p-2 text-xs text-forest/60">
                            <span>No products yet.</span>
                            {canQuickCreateProduct ? (
                              <button
                                type="button"
                                className="rounded-full border border-forest/20 px-3 py-1 text-forest hover:bg-forest/5"
                                onMouseDown={() => {
                                  createProductMutation.mutate({
                                    name: productQuery.trim(),
                                    price: Number(price)
                                  });
                                }}
                              >
                                Create "{productQuery.trim()}"
                              </button>
                            ) : (
                              <span className="text-[11px] text-forest/50">
                                Enter a unit price to create a product quickly.
                              </span>
                            )}
                            <Link className="text-forest underline" href="/admin/products/create">
                              Add a product
                            </Link>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" step="1" {...form.register("quantity")} />
                {form.formState.errors.quantity ? (
                  <p className="text-xs text-rose-600">Enter a valid quantity.</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Unit Price (NGN)</Label>
                <Input type="number" min="0" step="0.01" {...form.register("price")} />
                {form.formState.errors.price ? (
                  <p className="text-xs text-rose-600">Enter a valid unit price.</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Shipping Fee</Label>
                <Input type="number" min="0" step="0.01" {...form.register("shippingFee")} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>VAT Amount</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 rounded-full border-forest/20 text-xs text-forest"
                    onClick={() => setAutoVat((prev) => !prev)}
                  >
                    {autoVat ? `Auto ${vatRate}%` : "Manual VAT"}
                  </Button>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  disabled={autoVat}
                  {...form.register("vatAmount")}
                />
                <p className="text-xs text-forest/50">
                  {autoVat
                    ? `Auto-calculated at ${vatRate}% of subtotal.`
                    : "Enter the VAT amount (decimals allowed)."}
                </p>
              </div>
            </div>

            {submitError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                {submitError}
              </div>
            ) : null}

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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-forest">Recent Orders</h3>
        </div>
      </div>

      <div className="rounded-3xl border border-forest/10 bg-white shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
        <div className="flex flex-col gap-4 border-b border-forest/10 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-forest/60">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/10 text-forest">
              <RefreshCw className="h-4 w-4" />
            </span>
            Showing {orders.length} of {total} Orders
          </span>
          <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap">
            <Button
              variant="outline"
              size="sm"
              className="h-10 rounded-full border-forest/15 bg-white text-forest hover:bg-forest/5"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-10 rounded-full border-forest/15 bg-white text-forest hover:bg-forest/5 ${
                deliveryFilter !== "all" ? "border-forest/40 bg-forest/5" : ""
              }`}
              onClick={() =>
                setDeliveryFilter((prev) => (prev === "all" ? "delivery" : "all"))
              }
            >
              <Truck className="h-4 w-4" />
              Delivery
            </Button>
            <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-10 min-w-[190px] rounded-full border border-forest/15 bg-white px-4 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                <CalendarDays className="h-4 w-4 text-forest/60" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/40" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-[200px] rounded-full pl-9"
                placeholder="Search"
              />
            </div>
          </div>
        </div>

        <div className="px-6 pb-5">
          <div className="overflow-hidden rounded-2xl border border-forest/10">
            <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="w-10 pl-4">
                  <input type="checkbox" className="h-4 w-4" />
                </TableHead>
                <TableHead>Order Number & Name</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Downloads</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="pl-4">
                      <input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell className="font-semibold text-forest">
                      <div>{order.orderNumber}</div>
                      <div className="text-xs text-forest/50">
                        {order.customer
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : "Guest"}
                      </div>
                    </TableCell>
                    <TableCell>₦{order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadge(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === "PAID" ? "success" : "warning"}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.shippingFee > 0
                        ? `Delivery (₦${order.shippingFee.toLocaleString("en-NG")})`
                        : "Pickup"}
                    </TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString("en-NG")}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full border-forest/20 text-xs text-forest hover:bg-forest/5"
                      onClick={() => {
                        statusForm.reset({
                          orderId: order.id,
                          status: order.status as StatusForm["status"],
                          paymentStatus: order.paymentStatus as StatusForm["paymentStatus"]
                        });
                        setStatusOpen(true);
                      }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-sm text-forest/50">
                      <div className="rounded-3xl bg-forest/5 p-4">
                        <PackageSearch className="h-8 w-8 text-forest/40" />
                      </div>
                      <div>
                        <p className="font-semibold text-forest">No record found</p>
                        <p className="text-xs text-forest/50">Record your first order to see data here.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            </Table>
          </div>
        </div>

        {filteredOrders.length ? (
          <div className="flex items-center gap-2 border-t border-forest/10 px-6 py-4 text-sm text-forest/60">
            <span>Show</span>
            <Select defaultValue="25">
              <SelectTrigger className="h-9 w-[90px] rounded-full text-xs font-semibold uppercase tracking-[0.2em]">
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
        ) : null}
      </div>
    </div>
  );
}

