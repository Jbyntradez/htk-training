import Link from "next/link";
import { Activity, Gauge, LayoutDashboard, ListChecks } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/modules", label: "Training Modules", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: Gauge }
];

export function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-htk-panel md:fixed md:inset-y-0 md:left-0 md:w-72 md:border-b-0 md:border-r">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link href="/dashboard" className="grid gap-1">
          <span className="text-sm font-black uppercase text-accent">HTK Operator</span>
          <span className="text-xs font-black uppercase text-htk-red">Performance platform</span>
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto p-3 md:grid md:p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex shrink-0 items-center gap-3 rounded-md border border-transparent px-4 py-3 text-sm font-black text-accent/65 transition hover:border-htk-red/35 hover:bg-htk-red/[0.07] hover:text-white"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
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
        </div>
      </div>
    </aside>
  );
}
