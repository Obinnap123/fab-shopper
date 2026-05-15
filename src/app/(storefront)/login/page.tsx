"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { PasswordInput } from "@/components/ui/password-input";
import { loginCustomerRequest } from "@/features/customer-auth/client";
import { customerSessionQueryKey, fetchCustomerSession } from "@/features/customer-auth/session";
import { loginSchema, type LoginInput } from "@/features/customer-auth/schemas";

function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get("redirect");
  const [error, setError] = useState<string | null>(null);

  const getPostAuthRedirect = () => {
    if (!redirectParams) {
      return "/account?entry=login";
    }

    if (redirectParams.startsWith("/account")) {
      const separator = redirectParams.includes("?") ? "&" : "?";
      return `${redirectParams}${separator}entry=login`;
    }

    return redirectParams;
  };

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      setError(null);
      await loginCustomerRequest(values);
      await queryClient.fetchQuery({
        queryKey: customerSessionQueryKey,
        queryFn: fetchCustomerSession
      });

      toast.success("Welcome back to Fab Shopper!");
      router.push(getPostAuthRedirect());
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid credentials. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-[rgba(26,60,46,0.05)] bg-white p-8 shadow-[0_12px_40px_rgba(26,60,46,0.08)] md:p-12">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-display italic text-[var(--brand-green)]">Welcome Back</h1>
        <p className="text-sm text-[var(--brand-green)]/60">Enter your details to access your account.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            className="h-12 rounded-xl border border-[var(--brand-green)]/20 bg-transparent px-4 transition-all focus:border-[var(--brand-green)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-green)]"
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
          className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--brand-green)] font-semibold text-white transition-colors hover:bg-[var(--brand-green)]/90 disabled:opacity-70"
        >
          {form.formState.isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-[var(--brand-green)]/60">
        Don't have an account?{" "}
        <a
          href={redirectParams ? `/register?redirect=${encodeURIComponent(redirectParams)}` : "/register"}
          className="font-semibold text-[var(--brand-green)] transition-colors hover:text-[var(--brand-gold)]"
        >
          Create one
        </a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col justify-center bg-[var(--brand-cream)] px-6 py-20">
      <PageSpacer />
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-green)]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
