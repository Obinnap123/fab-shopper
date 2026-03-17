import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const staff = [
  { name: "Zikora Clinton Obi", role: "Super Admin", lastLogin: "Mar 12, 2026" },
  { name: "Amaka Uche", role: "Staff", lastLogin: "Mar 11, 2026" }
];

export default function StaffPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Operations"
          title="Staff Accounts"
          subtitle="Manage internal users and roles."
          actions={
            <button className="rounded-full bg-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cream">
              Add Staff
            </button>
          }
        />

        <SectionCard title="Staff Directory">
          <div className="space-y-3">
            {staff.map((member) => (
              <div key={member.name} className="flex items-center justify-between rounded-2xl border border-forest/10 px-4 py-3">
                <div>
                  <p className="font-semibold text-forest">{member.name}</p>
                  <p className="text-sm text-forest/60">{member.role}</p>
                </div>
                <p className="text-sm text-forest/60">Last login: {member.lastLogin}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
