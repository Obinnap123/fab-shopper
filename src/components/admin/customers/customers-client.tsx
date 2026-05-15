"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchJson } from "@/lib/fetch-json";

const customerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

type CustomerForm = z.infer<typeof customerSchema>;

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  deletedAt?: string | null;
};

function formatDeletedDate(value: string) {
  return new Date(value).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function CustomersClient() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"active" | "deleted" | "all">("active");

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" }
  });

  const { data } = useQuery({
    queryKey: ["customers", statusFilter],
    queryFn: async () => {
      const json = await fetchJson<{ data: Customer[] }>(`/api/customers?status=${statusFilter}`);
      return json.data as Customer[];
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: CustomerForm) => {
      return fetchJson("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      form.reset();
      setOpen(false);
      toast.success("Customer added successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Couldn't create customer.");
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "active", label: "Active" },
            { value: "deleted", label: "Deleted" },
            { value: "all", label: "All" }
          ].map((filter) => (
            <Button
              key={filter.value}
              type="button"
              variant={statusFilter === filter.value ? "default" : "outline"}
              onClick={() => setStatusFilter(filter.value as typeof statusFilter)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Customer</DialogTitle>
            </DialogHeader>

            <form
              className="mt-6 space-y-4"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input {...form.register("firstName")} />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input {...form.register("lastName")} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" {...form.register("email")} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input {...form.register("phone")} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Customer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).length ? (
            (data ?? []).map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-semibold text-forest">
                  {customer.firstName} {customer.lastName}
                </TableCell>
                <TableCell>{customer.email ?? "-"}</TableCell>
                <TableCell>{customer.phone ?? "-"}</TableCell>
                <TableCell>
                  {customer.deletedAt ? (
                    <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-600">
                      Deleted {formatDeletedDate(customer.deletedAt)}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
                      Active
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <div className="py-10 text-center text-sm text-forest/60">
                  {statusFilter === "deleted"
                    ? "No deleted customers found."
                    : statusFilter === "all"
                      ? "No customers found yet."
                      : "No active customers yet. Add your first customer to get started."}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
