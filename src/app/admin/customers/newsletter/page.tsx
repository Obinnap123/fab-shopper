import { AdminShell } from "@/components/admin/layout/admin-shell";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";

const subscribers = [
  { email: "zainab@email.com", date: "Mar 10, 2026" },
  { email: "renee@email.com", date: "Mar 08, 2026" }
];

export default function NewsletterPage() {
  return (
    <AdminShell>
      <section className="space-y-6">
        <PageHeader
          eyebrow="Customers"
          title="Newsletter"
          subtitle="Manage subscribers and send campaigns."
          actions={
            <button className="rounded-full bg-forest px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cream">
              Create Campaign
            </button>
          }
        />

        <SectionCard title="Subscribers">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.3em] text-forest/50">
                <tr>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Date Added</th>
                </tr>
              </thead>
              <tbody className="text-forest/70">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.email} className="border-t border-forest/10">
                    <td className="py-3 font-semibold text-forest">{subscriber.email}</td>
                    <td className="py-3">{subscriber.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </section>
    </AdminShell>
  );
}
