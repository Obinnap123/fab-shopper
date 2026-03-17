import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 text-2xl font-semibold text-forest">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm text-forest/60">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
