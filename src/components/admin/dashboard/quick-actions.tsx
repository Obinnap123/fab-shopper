const actions = [
  { title: "Create New Order", note: "Manual order intake" },
  { title: "Add New Product", note: "Launch new arrivals" },
  { title: "Run Sales Campaign", note: "Schedule promotions" }
];

const channels = [
  { name: "Website", value: "62%" },
  { name: "Instagram", value: "18%" },
  { name: "WhatsApp", value: "10%" },
  { name: "Walk-in", value: "6%" },
  { name: "Resellers", value: "4%" }
];

export function QuickActions() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_15px_40px_rgba(26,60,46,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Quick Actions</p>
        <ul className="mt-4 space-y-3 text-sm text-forest/70">
          {actions.map((action) => (
            <li key={action.title} className="rounded-2xl border border-forest/10 px-4 py-3">
              <p className="font-semibold text-forest">{action.title}</p>
              <p className="text-xs text-forest/50">{action.note}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_15px_40px_rgba(26,60,46,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">Top Sales Channels</p>
        <ul className="mt-4 space-y-3 text-sm text-forest/70">
          {channels.map((channel) => (
            <li key={channel.name} className="flex items-center justify-between">
              <span>{channel.name}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {channel.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
