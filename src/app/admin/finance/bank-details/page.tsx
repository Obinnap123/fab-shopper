import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const banks = [
  "Access Bank",
  "GTBank",
  "First Bank",
  "UBA",
  "Zenith Bank",
  "Sterling Bank",
  "Wema Bank",
  "Kuda",
  "Moniepoint",
  "Providus Bank"
];

export default function BankDetailsPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Finance"
          title="Bank Details"
          subtitle="Set up payout accounts for settlements."
        />

        <SectionCard title="Business Bank Account" subtitle="Account name will be verified via Paystack.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Bank Name</Label>
              <Select defaultValue={banks[0]}>
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account Number</Label>
              <Input placeholder="0123456789" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Account Name</Label>
              <Input placeholder="Fab Shopper Ltd" />
              <p className="text-xs text-forest/50">Auto-verified once account number is entered.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button className="rounded-full bg-forest text-cream">Save Bank Details</Button>
          </div>
        </SectionCard>

        <SectionCard title="Upgrade" subtitle="Add Business Bank Account">
          <div className="rounded-2xl border border-forest/10 bg-forest/5 px-4 py-3 text-sm text-forest/60">
            Multi-account support is coming soon. Upgrade to enable multiple bank accounts.
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
