import { StaffClient } from "@/components/admin/staff/staff-client";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export default async function StaffPage() {
  const admin = await requireSuperAdmin();
  if (!admin) {
    redirect("/admin/products");
  }

  return <StaffClient />;
}
