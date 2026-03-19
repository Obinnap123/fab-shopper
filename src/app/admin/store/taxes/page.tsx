import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

async function getTaxes() {
  try {
    return await prisma.tax.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [] as Array<{
      id: string;
      name: string;
      description: string | null;
      percentage: unknown;
      createdAt: Date;
    }>;
  }
}

export default async function TaxesPage() {
  const taxes = await getTaxes();

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="Taxes"
          subtitle="Manage tax rates applied at checkout."
        />

        <SectionCard title="Tax Rates" subtitle="VAT is pre-seeded at 7.5%">
          <div className="overflow-hidden rounded-2xl border border-forest/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead>Tax Name</TableHead>
                  <TableHead>Tax Description</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Date Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxes.length ? (
                  taxes.map((tax) => (
                    <TableRow key={tax.id}>
                      <TableCell className="font-semibold text-forest">{tax.name}</TableCell>
                      <TableCell>{tax.description ?? "—"}</TableCell>
                      <TableCell>{Number(tax.percentage)}%</TableCell>
                      <TableCell>{new Date(tax.createdAt).toLocaleDateString("en-NG")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-forest/60">
                      No tax records yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Create Tax" subtitle="Configure tax for online, offline, and POS sales.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Tax Name</Label>
              <Input placeholder="VAT" />
            </div>
            <div className="space-y-2">
              <Label>Percentage (%)</Label>
              <Input placeholder="7.5" />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input placeholder="Value Added Tax" />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-forest/70">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" /> Apply to offline orders
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" defaultChecked /> Apply to website checkout
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="h-4 w-4" /> Apply to POS checkout
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="rounded-full bg-forest text-cream">Save Tax</Button>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
