"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const locations = [
  { id: "hq", label: "Headquarters (Lagos state)" },
  { id: "vi", label: "Victoria Island" },
  { id: "ikeja", label: "Ikeja" }
];

const shippingSchema = z.object({
  locationName: z.string().min(2, "Enter a location name"),
  fee: z.string().optional(),
  description: z.string().optional(),
  locationId: z.string().optional()
});

type ShippingForm = z.infer<typeof shippingSchema>;

type ShippingMethod = {
  id: string;
  locationName: string;
  description?: string | null;
  fee: number;
  isFree: boolean;
  createdAt: string;
};

const formatCurrency = (value: number) =>
  `₦${value.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export function ShippingClient() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { locationName: "", fee: "", description: "", locationId: locations[0].id }
  });

  const { data } = useQuery({
    queryKey: ["shipping-methods"],
    queryFn: async () => {
      const res = await fetch("/api/shipping");
      const json = await res.json();
      return (json.data ?? []) as ShippingMethod[];
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: { locationName: string; description?: string; fee?: number; isFree?: boolean }) => {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error ?? "Failed to create shipping method");
      return payload as { data: ShippingMethod };
    },
    onSuccess: async () => {
      setFeedback("Shipping method saved.");
      form.reset({ locationName: "", fee: "", description: "", locationId: locations[0].id });
      await queryClient.invalidateQueries({ queryKey: ["shipping-methods"] });
      setOpen(false);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : "Failed to create shipping method");
    }
  });

  const handleSubmit = (values: ShippingForm) => {
    const feeValue = values.fee?.trim() ? Number(values.fee) : undefined;
    mutation.mutate({
      locationName: values.locationName,
      description: values.description?.trim() || undefined,
      fee: feeValue
    });
  };

  const handleFreeShipping = () => {
    mutation.mutate({
      locationName: "Free Delivery",
      description: "Free delivery option",
      fee: 0,
      isFree: true
    });
  };

  const methods = data ?? [];

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Operations"
          title="Shipping Methods"
          subtitle="Manage delivery zones and pickup options."
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="rounded-full border-forest/30 text-forest"
                onClick={handleFreeShipping}
                disabled={mutation.isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Free Shipping
              </Button>
              <Button
                className="rounded-full bg-forest text-cream"
                onClick={() => setOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </div>
          }
        />

        <SectionCard title="Shipping Zones" subtitle="Pre-populated Nigerian zones">
          <div className="overflow-hidden rounded-2xl border border-forest/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead className="py-4">Date</TableHead>
                  <TableHead className="py-4">Location Name</TableHead>
                  <TableHead className="py-4">Description</TableHead>
                  <TableHead className="py-4">Shipping Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {methods.length ? (
                  methods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell className="py-4">{new Date(method.createdAt).toLocaleDateString("en-NG")}</TableCell>
                      <TableCell className="py-4 font-semibold text-forest">{method.locationName}</TableCell>
                      <TableCell className="py-4">{method.description ?? "—"}</TableCell>
                      <TableCell className="py-4">{method.isFree ? "Free" : formatCurrency(Number(method.fee))}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-forest/60">
                      No shipping methods yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Shipping Method</DialogTitle>
            </DialogHeader>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-2 md:col-span-2">
                <Label>Location Name</Label>
                <Input placeholder="South West" {...form.register("locationName")} />
                {form.formState.errors.locationName ? (
                  <p className="text-xs text-red-500">{form.formState.errors.locationName.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Shipping Fee</Label>
                <Input placeholder="6500" {...form.register("fee")} />
                <p className="text-xs text-forest/50">Leave blank for free shipping.</p>
              </div>
              <div className="space-y-2">
                <Label>Select Locations</Label>
                <Select
                  value={form.watch("locationId")}
                  onValueChange={(value) => form.setValue("locationId", value)}
                >
                  <SelectTrigger className="h-11 rounded-2xl">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Shipping Description</Label>
                <Input placeholder="Ekiti, Osun, Ondo, Ogun, Oyo" {...form.register("description")} />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-forest text-cream"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving..." : "Save Method"}
                </Button>
              </div>
            </form>

            {feedback ? <p className="mt-3 text-sm text-forest/70">{feedback}</p> : null}
          </DialogContent>
        </Dialog>
      </section>
    </AdminShell>
  );
}
