import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function SectionCard({ title, subtitle, actions, className, children }: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-forest/10 bg-white p-6 shadow-[0_15px_40px_rgba(26,60,46,0.08)]",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-forest/60">{title}</p>
          {subtitle ? <p className="mt-2 text-sm text-forest/60">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}
