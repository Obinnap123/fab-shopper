import type { ReactNode } from "react";

type AuthFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function AuthField({ label, error, children }: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-rose-500">{error}</p> : null}
    </div>
  );
}
