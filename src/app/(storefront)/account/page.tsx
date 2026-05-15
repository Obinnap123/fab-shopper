import { PageSpacer } from "@/components/storefront/layout/page-spacer";
import { AccountDashboard } from "@/components/storefront/account/account-dashboard";
import { getCustomerAccountPageData, requireActiveCustomer } from "@/lib/customer-account";

type AccountPageProps = {
  searchParams?: Promise<{
    entry?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const customer = await requireActiveCustomer("/account");
  const data = await getCustomerAccountPageData(customer.id);
  const resolvedSearchParams = await searchParams;
  const greetingVariant = resolvedSearchParams?.entry === "signup" ? "signup" : "login";

  if (!data) {
    return null;
  }

  return (
    <main className="bg-[var(--brand-cream)]">
      <PageSpacer />
      <AccountDashboard initialData={data} greetingVariant={greetingVariant} />
    </main>
  );
}
