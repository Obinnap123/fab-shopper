import { AdminShell } from "@/components/admin/layout/admin-shell";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  if (!admin) {
    return <>{children}</>;
  }

  return <AdminShell role={admin.role}>{children}</AdminShell>;
}
