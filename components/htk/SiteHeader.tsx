"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/htk/BrandMark";
import { CtaLink } from "@/components/htk/CtaLink";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";
import { cn } from "@/lib/utils";

const defaultNavItems = [
  { label: "Home", href: "/" },
  { label: "Results", href: "/results" },
  { label: "Apply", href: HTK_APPLICATION_PATH },
  { label: "Book", href: HTK_BOOKING_URL, external: true }
];

export function SiteHeader({
  currentPath,
  className
}: {
  currentPath?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl",
        className
      )}
    >
      <div className="container-px mx-auto flex h-[72px] max-w-7xl items-center justify-between py-4">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-white/60 lg:flex">
          {defaultNavItems.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "transition hover:text-white",
                  currentPath === item.href && "text-white"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink href={HTK_BOOKING_URL} external size="sm" className="hidden sm:inline-flex">
            Book Now
          </CtaLink>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex size-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-white transition hover:border-red-500/35 hover:bg-red-500/[0.08] lg:hidden"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <CtaLink href={HTK_BOOKING_URL} external size="sm" className="sm:hidden">
            Book
          </CtaLink>
        </div>
      </div>
      {isOpen ? (
        <div className="border-t border-white/10 bg-[#050505]/98 lg:hidden">
          <nav className="container-px mx-auto max-w-7xl py-4">
            <div className="grid gap-2">
              {defaultNavItems.map((item) =>
                item.external ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-12 items-center rounded-md border border-white/10 bg-white/[0.035] px-4 text-sm font-black text-white/78 transition hover:border-red-500/35 hover:bg-red-500/[0.06] hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex min-h-12 items-center rounded-md border px-4 text-sm font-black transition",
                      currentPath === item.href
                        ? "border-red-500/45 bg-red-500/[0.08] text-white"
                        : "border-white/10 bg-white/[0.035] text-white/78 hover:border-red-500/35 hover:bg-red-500/[0.06] hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
