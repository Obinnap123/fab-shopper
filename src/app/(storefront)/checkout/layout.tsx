import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/customer-auth";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession();
  
  if (!session) {
    redirect("/login?redirect=/checkout");
  }

  return <>{children}</>;
}
