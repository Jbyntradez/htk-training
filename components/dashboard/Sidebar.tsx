"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Gauge, LayoutDashboard, ListChecks } from "lucide-react";
import { HtkWordmark } from "@/components/htk/HtkWordmark";
import { Microcopy } from "@/components/ui/microcopy";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/modules", label: "Training Modules", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: Gauge }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-white/10 bg-htk-panel md:fixed md:inset-y-0 md:left-0 md:w-72 md:border-b-0 md:border-r">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <HtkWordmark href="/dashboard" label="Go to HTK dashboard home" eyebrow="Performance platform" />
      </div>
      <nav className="flex gap-2 overflow-x-auto p-3 md:grid md:p-4">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-md border px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
                active
                  ? "border-htk-red/55 bg-htk-red/[0.1] text-white"
                  : "border-transparent text-accent/65 hover:border-htk-red/35 hover:bg-htk-red/[0.07] hover:text-white"
              )}
              aria-label={`Go to ${item.label}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden px-4 md:block">
        <div className="rounded-md border border-white/10 bg-black/35 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-htk-red text-white">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-black">Today&apos;s standard</p>
              <p className="text-xs text-htk-muted">Check in, train, report</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-htk-muted">
            Log readiness before training, complete the assigned work, and keep your coachable data honest.
          </p>
          <Microcopy
            label="What this means"
            description="This card is a daily operating reminder: check in first, train with the assigned intent, then report completion and notes."
            icon={<Activity className="h-3.5 w-3.5" />}
            className="mt-4"
          />
        </div>
      </div>
    </aside>
  );
}
