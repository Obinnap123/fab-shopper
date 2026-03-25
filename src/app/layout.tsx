import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppProviders } from "@/components/providers/app-providers";
import NextTopLoader from "nextjs-toploader";
import { prisma } from "@/lib/prisma";
import Script from "next/script";

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

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let snapPixelId = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings = await (prisma as any).storeSettings.findFirst();
    snapPixelId = settings?.snapPixelId;
  } catch (e) {}

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${serif.variable} antialiased`}>
        {snapPixelId && (
          <Script id="snap-pixel" strategy="afterInteractive">
            {`
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');
              
              snaptr('init', '${snapPixelId}');
              snaptr('track', 'PAGE_VIEW');
            `}
          </Script>
        )}
        <NextTopLoader
          color="var(--brand-gold)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--brand-gold),0 0 5px var(--brand-gold)"
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
