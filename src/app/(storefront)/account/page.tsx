import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { AccountDashboard } from "@/components/storefront/account/account-dashboard";
import { getCustomerAccountPageData, requireActiveCustomer } from "@/lib/customer-account";

export default async function AccountPage() {
  const customer = await requireActiveCustomer("/account");
  const data = await getCustomerAccountPageData(customer.id);

  if (!data) {
    return null;
  }

  return (
    <main className="bg-[var(--brand-cream)]">
      <PageSpacer />
      <AccountDashboard initialData={data} />
    </main>
  );
}
