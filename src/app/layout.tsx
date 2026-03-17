import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Fab Shopper",
  description: "Luxury Lagos womenswear and accessories."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable} antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
