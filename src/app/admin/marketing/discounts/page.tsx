import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DiscountsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Sales & Marketing"
          title="Discounts & Coupons"
          subtitle="Create discount codes and promotional offers."
        />

        <SectionCard title="Create Coupon">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <Input placeholder="FAB10" />
            </div>
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select defaultValue="percentage">
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label>Minimum Order</Label>
              <Input placeholder="50000" />
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Usage Limit</Label>
              <Input placeholder="100" />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="rounded-full bg-forest text-cream">Create Coupon</Button>
          </div>
        </SectionCard>

        <SectionCard title="Active Coupons" subtitle="Manage existing discount codes">
          <div className="rounded-2xl border border-forest/10 p-6 text-sm text-forest/60">
            No active coupons yet.
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
