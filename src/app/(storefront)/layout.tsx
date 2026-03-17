import { AnnouncementBar } from "@/components/storefront/layout/announcement-bar";
import { StorefrontFooter } from "@/components/storefront/layout/footer";
import { StorefrontNavbar } from "@/components/storefront/layout/navbar";

export default function StorefrontLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <AnnouncementBar />
      <StorefrontNavbar />
      <main>{children}</main>
      <StorefrontFooter />
    </div>
  );
}
