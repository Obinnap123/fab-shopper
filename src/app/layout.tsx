import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppProviders } from "@/components/providers/app-providers";

const sans = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "../../public/fonts/dm-sans/dm-sans-400-normal.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/dm-sans/dm-sans-500-normal.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/dm-sans/dm-sans-600-normal.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/dm-sans/dm-sans-700-normal.ttf", weight: "700", style: "normal" }
  ]
});

const serif = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-400-normal.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-500-normal.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-600-normal.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-700-normal.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-400-italic.ttf", weight: "400", style: "italic" },
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-500-italic.ttf", weight: "500", style: "italic" },
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-600-italic.ttf", weight: "600", style: "italic" },
    { path: "../../public/fonts/cormorant-garamond/cormorant-garamond-700-italic.ttf", weight: "700", style: "italic" }
  ]
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
