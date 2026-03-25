import { AdminShell } from "@/components/admin/layout/admin-shell";
import { UserCircle } from "lucide-react";
import { EditProfileForm } from "./edit-profile-form";

export default function AdminProfilePage() {
  return (
    <AdminShell>
      <section className="space-y-8 max-w-2xl">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Account</p>
          <h1 className="text-2xl font-semibold text-forest">My Profile</h1>
          <p className="text-sm text-forest/60">Manage your administrative credentials and display name.</p>
        </div>

        <div className="rounded-3xl border border-forest/10 bg-white p-6 md:p-8 shadow-[0_12px_30px_rgba(26,60,46,0.08)]">
          <div className="flex items-center gap-4 border-b border-forest/10 pb-6 mb-6">
            <div className="h-16 w-16 bg-forest/5 rounded-full flex items-center justify-center">
              <UserCircle className="h-8 w-8 text-forest/40" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-forest">Personal Information</h2>
              <p className="text-sm text-forest/60">Update your account name and security details.</p>
            </div>
          </div>
          
          <EditProfileForm />
        </div>
      </section>
    </AdminShell>
  );
}
