"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackCtaClick } from "@/lib/analytics";

export function TrackedPrimaryLink({
  href,
  label,
  className,
  children
}: {
  href: string;
  label: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={className} onClick={() => trackCtaClick(label, href)}>
      {children}
    </Link>
  );
}
