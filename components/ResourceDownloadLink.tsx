"use client";

import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { event as analyticsEvent } from "@/lib/analytics";

export function ResourceDownloadLink({
  href,
  resourceTitle,
  children = "Download Free Resource"
}: {
  href: string;
  resourceTitle: string;
  children?: ReactNode;
}) {
  const label = typeof children === "string" ? children : "Download Free Resource";

  return (
    <a
      href={href}
      download
      className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-500 px-5 text-sm font-black text-white shadow-[0_0_36px_rgba(220,38,38,0.28)] transition hover:bg-red-400 hover:shadow-[0_0_52px_rgba(220,38,38,0.44)] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#080808] sm:w-fit"
      onClick={() => {
        analyticsEvent("button_click", "CTA", label);
        analyticsEvent("lead_magnet_download", "Lead Magnet Funnel", resourceTitle);
      }}
    >
      {children}
      <Download className="ml-2 size-4" />
    </a>
  );
}
