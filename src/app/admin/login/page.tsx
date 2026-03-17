"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setError(payload?.error ?? "Unable to sign in.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-forest/15 bg-white p-10 shadow-[0_30px_80px_rgba(26,60,46,0.12)]">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gold">Fab Shopper Admin</p>
        <h1 className="mt-4 text-3xl font-semibold text-forest">Welcome back</h1>
        <p className="mt-2 text-sm text-forest/60">Sign in to manage products, orders, and storefront settings.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-forest/20 px-4 py-3 text-sm text-forest outline-none focus:border-forest"
              placeholder="admin@fabshopper.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-forest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-forest/20 px-4 py-3 text-sm text-forest outline-none focus:border-forest"
              placeholder="????????"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            className="w-full rounded-full bg-forest px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-cream transition hover:bg-[#163326]"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
