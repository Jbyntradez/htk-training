import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTK Training | Hard to Kill Training",
  description:
    "Premium tactical performance coaching and consultations for athletes, high performers, and disciplined individuals."
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans text-accent antialiased">
        {gaId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: false });
                window.htkGaReady = true;
                window.dispatchEvent(new Event('htk-ga-ready'));
              `}
            </Script>
            <Suspense fallback={null}>
              <PageViewTracker />
            </Suspense>
          </>
        ) : null}
        {children}
      </body>
    </html>
  );
}
