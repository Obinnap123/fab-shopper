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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParams = searchParams.get("redirect");
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const res = await fetch("/api/customer-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      toast.success("Welcome back to Fab Shopper!");
      const redirect = redirectParams || "/";
      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md bg-white p-8 md:p-12 rounded-3xl shadow-[0_12px_40px_rgba(26,60,46,0.08)] border border-[rgba(26,60,46,0.05)]">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-display italic text-[var(--brand-green)] mb-2">Welcome Back</h1>
        <p className="text-sm text-[var(--brand-green)]/60">Enter your details to access your account.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Email Address</label>
          <input
            {...form.register("email")}
            type="email"
            className="w-full h-12 px-4 rounded-xl border border-[var(--brand-green)]/20 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)] bg-transparent transition-all"
            placeholder="you@example.com"
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-rose-500">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-green)]/70">Password</label>
          <input
            {...form.register("password")}
            type="password"
            className="w-full h-12 px-4 rounded-xl border border-[var(--brand-green)]/20 focus:outline-none focus:border-[var(--brand-green)] focus:ring-1 focus:ring-[var(--brand-green)] bg-transparent transition-all"
            placeholder="••••••••"
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-rose-500">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-12 rounded-full bg-[var(--brand-green)] text-white font-semibold flex items-center justify-center hover:bg-[var(--brand-green)]/90 transition-colors disabled:opacity-70"
        >
          {form.formState.isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-[var(--brand-green)]/60">
        Don't have an account?{" "}
        <Link 
          href={redirectParams ? `/register?redirect=${encodeURIComponent(redirectParams)}` : `/register`} 
          className="font-semibold text-[var(--brand-green)] hover:text-[var(--brand-gold)] transition-colors"
        >
          Create one
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] px-6 py-20 flex flex-col justify-center">
      <PageSpacer />
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--brand-green)]" /></div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
