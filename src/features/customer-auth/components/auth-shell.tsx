import type { ReactNode } from "react";
import Link from "next/link";

type AuthShellProps = {
  title: string;
  description: string;
  footerLabel: string;
  footerLinkLabel: string;
  footerLinkHref: string;
  children: ReactNode;
};

export function AuthShell({
  title,
  description,
  footerLabel,
  footerLinkLabel,
  footerLinkHref,
  children
}: AuthShellProps) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-[rgba(26,60,46,0.05)] bg-white p-8 shadow-[0_12px_40px_rgba(26,60,46,0.08)] md:p-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-display italic text-[var(--brand-green)]">{title}</h1>
        <p className="text-sm text-[var(--brand-green)]/60">{description}</p>
      </div>

      {children}

      <div className="mt-8 text-center text-sm text-[var(--brand-green)]/60">
        {footerLabel}{" "}
        <Link
          href={footerLinkHref}
          className="font-semibold text-[var(--brand-green)] transition-colors hover:text-[var(--brand-gold)]"
        >
          {footerLinkLabel}
        </Link>
      </div>
    </div>
  );
}
