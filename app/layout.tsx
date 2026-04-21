import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTK Training | Hard to Kill Training",
  description:
    "Premium tactical performance coaching and consultations for athletes, high performers, and disciplined individuals."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans text-accent antialiased">
        {children}
      </body>
    </html>
  );
}
