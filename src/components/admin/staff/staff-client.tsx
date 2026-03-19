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

const staffSchema = z.object({
  name: z.string().min(2, "Enter a full name"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["SUPER_ADMIN", "STAFF"])
});

type StaffForm = z.infer<typeof staffSchema>;

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "STAFF";
  createdAt: string;
};

export function StaffClient() {
  const queryClient = useQueryClient();
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const slotLimit = 5;

  const form = useForm<StaffForm>({
    resolver: zodResolver(staffSchema),
    defaultValues: { name: "", email: "", role: "STAFF" }
  });

  const { data, isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      const json = await res.json();
      return (json.data ?? []) as StaffMember[];
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: StaffForm) => {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error ?? "Failed to create staff account");
      }
      return payload as { data: StaffMember; tempPassword: string };
    },
    onSuccess: async (payload) => {
      setTempPassword(payload.tempPassword);
      setErrorMessage(null);
      form.reset({ name: "", email: "", role: "STAFF" });
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (error) => {
      setTempPassword(null);
      setErrorMessage(error instanceof Error ? error.message : "Failed to create staff account");
    }
  });

  const staff = data ?? [];
  const slotsRemaining = Math.max(slotLimit - staff.length, 0);

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Operations"
          title="Staff Accounts"
          subtitle="Manage internal users and roles."
          actions={
            <Button className="rounded-full bg-forest text-cream" onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          }
        />

        <SectionCard title="Available Slots" subtitle="Staff capacity overview">
          <div className="flex items-center gap-3 text-sm text-forest/70">
            <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
              {staff.length}/{slotLimit} used
            </span>
            <span>{slotsRemaining} slots remaining</span>
          </div>
        </SectionCard>

        <SectionCard title="Staff Directory">
          <div className="overflow-hidden rounded-2xl border border-forest/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead>Date Added</TableHead>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-forest/60">
                      Loading staff accounts...
                    </TableCell>
                  </TableRow>
                ) : staff.length ? (
                  staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{new Date(member.createdAt).toLocaleDateString("en-NG")}</TableCell>
                      <TableCell className="font-semibold text-forest">{member.name}</TableCell>
                      <TableCell>{member.role === "SUPER_ADMIN" ? "Admin" : "Staff"}</TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-forest/60">
                      No staff accounts yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) {
              setTempPassword(null);
              setErrorMessage(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff</DialogTitle>
            </DialogHeader>
            <form
              className="mt-6 grid gap-4 md:grid-cols-2"
              onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
            >
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="Amaka Uche" {...form.register("name")} />
                {form.formState.errors.name ? (
                  <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input placeholder="amaka@fabshopper.com" {...form.register("email")} />
                {form.formState.errors.email ? (
                  <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                  value={form.watch("role")}
                  onValueChange={(value) => form.setValue("role", value as StaffForm["role"])}
                >
                  <SelectTrigger className="h-11 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Admin</SelectItem>
                    <SelectItem value="STAFF">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="rounded-full bg-forest text-cream"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Sending..." : "Send Invite"}
                </Button>
              </div>
            </form>

            {tempPassword ? (
              <div className="mt-4 rounded-2xl border border-forest/10 bg-forest/5 p-4 text-sm text-forest">
                Invite created. Temporary password:{" "}
                <span className="font-semibold text-forest">{tempPassword}</span>
                <p className="mt-2 text-xs text-forest/60">
                  Share this with the staff member so they can log in and change it.
                </p>
              </div>
            ) : null}

            {errorMessage ? (
              <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
            ) : null}
          </DialogContent>
        </Dialog>
      </section>
    </AdminShell>
  );
}
