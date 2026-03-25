"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAdminProfile } from "./actions";
import { Button } from "@/components/ui/button";

export function EditProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function action(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await updateAdminProfile(formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">Display Name</label>
          <input 
            type="text" 
            name="name" 
            placeholder="E.g. Delight Closet"
            required
            className="w-full rounded-xl border border-forest/10 px-4 py-3 text-sm focus:border-forest outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">New Password (Optional)</label>
          <input 
            type="password" 
            name="password" 
            placeholder="Leave blank to keep current"
            className="w-full rounded-xl border border-forest/10 px-4 py-3 text-sm focus:border-forest outline-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-[var(--brand-gold)] font-medium">Profile updated successfully!</p>}

      <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-forest text-cream hover:bg-[#163326]">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
