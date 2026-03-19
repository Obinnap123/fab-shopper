import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const locations = [
  {
    name: "Headquarters",
    address: "7B Nduka Osadebay Ajao Estate",
    country: "Nigeria",
    state: "Lagos",
    city: "Lagos"
  }
];

export default function StoreLocationPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Operations"
          title="Store Locations"
          subtitle="Manage fulfillment and pickup locations."
        />

        <SectionCard title="Locations">
          <div className="overflow-hidden rounded-2xl border border-forest/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50">
                  <TableHead>Location Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>City</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.name}>
                    <TableCell className="font-semibold text-forest">{location.name}</TableCell>
                    <TableCell>{location.address}</TableCell>
                    <TableCell>{location.country}</TableCell>
                    <TableCell>{location.state}</TableCell>
                    <TableCell>{location.city}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Add Location">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Location Name</Label>
              <Input placeholder="Victoria Island" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="Plot 10, Adeola Odeku" />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input placeholder="Nigeria" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input placeholder="Lagos" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input placeholder="Lagos" />
            </div>
            <div className="flex items-end">
              <Button className="rounded-full bg-forest text-cream">Save Location</Button>
            </div>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
