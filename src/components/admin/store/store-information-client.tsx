"use client";

import { useState } from "react";
import { CalendarDays, Pencil, Plus } from "lucide-react";

import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StoreInfo = {
  businessName: string;
  tagline: string;
  description: string;
  contactPhone: string;
  address: string;
  zipCode: string;
  currency: string;
};

type BusinessHour = { day: string; time: string };

const defaultInfo: StoreInfo = {
  businessName: "Fab Shopper",
  tagline: "Designed in Lagos. Styled worldwide.",
  description:
    "Fab Shopper curates refined womenswear and accessories built for confident, modern Lagos style. Thoughtful silhouettes, premium fabrics, and bold details.",
  contactPhone: "+234 812 000 0000",
  address: "Ajao Estate, Lagos, Nigeria",
  zipCode: "100001",
  currency: "NGN"
};

const defaultHours: BusinessHour[] = [
  { day: "Sunday", time: "00:00 - 23:59" },
  { day: "Monday", time: "00:00 - 23:59" },
  { day: "Tuesday", time: "00:00 - 23:59" },
  { day: "Wednesday", time: "00:00 - 23:59" },
  { day: "Thursday", time: "00:00 - 23:59" },
  { day: "Friday", time: "00:00 - 23:59" },
  { day: "Saturday", time: "00:00 - 23:59" }
];

export function StoreInformationClient() {
  const [info, setInfo] = useState<StoreInfo>(defaultInfo);
  const [hours, setHours] = useState<BusinessHour[]>(defaultHours);
  const [editOpen, setEditOpen] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);

  const [draftInfo, setDraftInfo] = useState<StoreInfo>(defaultInfo);
  const [draftHours, setDraftHours] = useState<BusinessHour[]>(defaultHours);

  const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInfo(draftInfo);
    setEditOpen(false);
  };

  const handleHoursSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHours(draftHours);
    setHoursOpen(false);
  };

  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Store Setup"
          title="Store Information"
          subtitle="A quick view of your store profile and operating hours."
          actions={
            <>
              <Button
                variant="outline"
                className="rounded-full border-forest/20 text-forest"
                onClick={() => {
                  setDraftHours(hours);
                  setHoursOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Business Hours
              </Button>
              <Button
                className="rounded-full bg-forest text-cream"
                onClick={() => {
                  setDraftInfo(info);
                  setEditOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Store Information
              </Button>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard title="Store Profile" className="h-full">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest text-base font-semibold text-cream">
                FS
              </div>
              <div>
                <p className="text-lg font-semibold text-forest">{info.businessName}</p>
                <p className="text-sm text-forest/60">{info.tagline}</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest/50">
                  Business Name
                </p>
                <p className="mt-1 text-sm text-forest">{info.businessName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest/50">
                  Store Tagline
                </p>
                <p className="mt-1 text-sm text-forest">{info.tagline}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest/50">
                  Store Description
                </p>
                <p className="mt-1 text-sm text-forest/70">{info.description}</p>
              </div>
            </div>
          </SectionCard>

          <div className="space-y-6">
            <SectionCard title="Store Information">
              <div className="space-y-4 text-sm text-forest">
                <div className="flex items-center justify-between border-b border-forest/10 pb-3">
                  <span className="text-forest/60">Contact Phone</span>
                  <span className="font-semibold">{info.contactPhone}</span>
                </div>
                <div className="flex items-center justify-between border-b border-forest/10 pb-3">
                  <span className="text-forest/60">Address</span>
                  <span className="font-semibold">{info.address}</span>
                </div>
                <div className="flex items-center justify-between border-b border-forest/10 pb-3">
                  <span className="text-forest/60">Zip-code</span>
                  <span className="font-semibold">{info.zipCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-forest/60">Store Currency</span>
                  <span className="font-semibold">{info.currency}</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Business Hours">
              <div className="space-y-4 text-sm text-forest">
                {hours.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between border-b border-forest/10 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="capitalize text-forest/60">{item.day}</span>
                    <span className="font-semibold">{item.time}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Store Information</DialogTitle>
            </DialogHeader>
            <form className="mt-6 space-y-4" onSubmit={handleEditSubmit}>
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input
                  value={draftInfo.businessName}
                  onChange={(event) => setDraftInfo({ ...draftInfo, businessName: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Store Tagline</Label>
                <Input
                  value={draftInfo.tagline}
                  onChange={(event) => setDraftInfo({ ...draftInfo, tagline: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Store Description</Label>
                <Textarea
                  value={draftInfo.description}
                  onChange={(event) => setDraftInfo({ ...draftInfo, description: event.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={draftInfo.contactPhone}
                    onChange={(event) => setDraftInfo({ ...draftInfo, contactPhone: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zip Code</Label>
                  <Input
                    value={draftInfo.zipCode}
                    onChange={(event) => setDraftInfo({ ...draftInfo, zipCode: event.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={draftInfo.address}
                  onChange={(event) => setDraftInfo({ ...draftInfo, address: event.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full bg-forest text-cream">
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={hoursOpen} onOpenChange={setHoursOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Business Hours</DialogTitle>
            </DialogHeader>
            <form className="mt-6 space-y-4" onSubmit={handleHoursSubmit}>
              {draftHours.map((item, index) => (
                <div key={item.day} className="flex items-center justify-between gap-3">
                  <Label className="w-28">{item.day}</Label>
                  <Input
                    value={item.time}
                    onChange={(event) => {
                      const next = [...draftHours];
                      next[index] = { ...next[index], time: event.target.value };
                      setDraftHours(next);
                    }}
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setHoursOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full bg-forest text-cream">
                  Save Hours
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    </AdminShell>
  );
}
