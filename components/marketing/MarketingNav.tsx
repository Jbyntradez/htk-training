import Link from "next/link";
import { CtaLink } from "@/components/htk/CtaLink";
import { HtkWordmark } from "@/components/htk/HtkWordmark";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";
import { cn } from "@/lib/utils";

export const marketingNavItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services", section: true },
  { label: "About", href: "#about", section: true },
  { label: "Process", href: "#process", section: true },
  { label: "Results", href: "#results", section: true },
  { label: "Free Resources", href: "/free-resources" },
  { label: "Apply", href: HTK_APPLICATION_PATH },
  { label: "Contact", href: "/contact" }
] as const;

type MarketingNavProps = {
  activeHref?: string;
  showBookingCta?: boolean;
};

export function MarketingNav({ activeHref = "/", showBookingCta = true }: MarketingNavProps) {
  const sectionPrefix = activeHref === "/" ? "" : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <div className="container-px mx-auto flex min-h-[72px] max-w-7xl flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <HtkWordmark className="focus:ring-red-400 focus:ring-offset-[#050505]" />
          {showBookingCta ? (
            <CtaLink href={HTK_BOOKING_URL} size="sm" className="lg:hidden">
              Book
            </CtaLink>
          ) : null}
        </div>

        <nav className="flex gap-2 overflow-x-auto text-[13px] font-semibold text-white/60 lg:items-center lg:gap-4 xl:gap-6 xl:text-sm">
          {marketingNavItems.map((item) => {
            const href = "section" in item && item.section ? `${sectionPrefix}${item.href}` : item.href;
            const active = item.href === activeHref || href === activeHref;

            return (
              <Link
                key={`${item.label}-${href}`}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md px-2 py-2 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#050505]",
                  active && "bg-red-500/10 text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {showBookingCta ? (
          <CtaLink href={HTK_BOOKING_URL} size="sm" className="hidden lg:inline-flex">
            Book Now
          </CtaLink>
        ) : null}
      </div>
    </header>
  );
}
