"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { PasswordInput } from "@/components/ui/password-input";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get("redirect");
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" }
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const res = await fetch("/api/customer-auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created! Welcome to Fab Shopper.");
      const redirect = redirectParams || "/";
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to register. Please try again.");
      toast.error(err.message || "Failed to register. Please try again.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl border border-[rgba(26,60,46,0.05)] bg-white p-8 shadow-[0_12px_40px_rgba(26,60,46,0.08)] md:p-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-display italic text-[var(--brand-green)]">Create Account</h1>
        <p className="text-sm text-[var(--brand-green)]/60">Join the Fab Shopper community today.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">First Name</label>
            <input
              {...form.register("firstName")}
              className="h-12 w-full rounded-xl border border-[var(--brand-green)]/20 bg-transparent px-4 transition-all focus:border-[var(--brand-green)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)]"
              placeholder="Jane"
            />
            {form.formState.errors.firstName ? (
              <p className="text-xs text-rose-500">{form.formState.errors.firstName.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Last Name</label>
            <input
              {...form.register("lastName")}
              className="h-12 w-full rounded-xl border border-[var(--brand-green)]/20 bg-transparent px-4 transition-all focus:border-[var(--brand-green)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)]"
              placeholder="Doe"
            />
            {form.formState.errors.lastName ? (
              <p className="text-xs text-rose-500">{form.formState.errors.lastName.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Email Address</label>
          <input
            {...form.register("email")}
            type="email"
            className="h-12 w-full rounded-xl border border-[var(--brand-green)]/20 bg-transparent px-4 transition-all focus:border-[var(--brand-green)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)]"
            placeholder="you@example.com"
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-rose-500">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Password</label>
          <PasswordInput
            {...form.register("password")}
            className="h-12 w-full rounded-xl border border-[var(--brand-green)]/20 bg-transparent px-4 transition-all focus:border-[var(--brand-green)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)]"
            placeholder="••••••••"
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-rose-500">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {error ? <p className="text-xs text-rose-500">{error}</p> : null}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand-green)] font-semibold text-white transition-colors hover:bg-[var(--brand-green)]/90 disabled:opacity-70"
        >
          {form.formState.isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-[var(--brand-green)]/60">
        Already have an account?{" "}
        <Link
          href={redirectParams ? `/login?redirect=${encodeURIComponent(redirectParams)}` : "/login"}
          className="font-semibold text-[var(--brand-green)] transition-colors hover:text-[var(--brand-gold)]"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] px-6 py-20 flex flex-col justify-center">
      <PageSpacer />
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" /></div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
