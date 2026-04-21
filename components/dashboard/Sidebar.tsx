import Link from "next/link";
import { Gauge, LayoutDashboard, ListChecks, Zap } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/modules", label: "Modules", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: Gauge }
];

export function Sidebar() {
  return (
    <aside className="border-b border-white/10 bg-primary md:fixed md:inset-y-0 md:left-0 md:w-72 md:border-b-0 md:border-r">
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link href="/dashboard" className="grid gap-1">
          <span className="text-sm font-black uppercase">Hard to Kill</span>
          <span className="text-xs uppercase text-accent/40">Playbook command</span>
        </Link>
      </div>
      <nav className="flex gap-2 overflow-x-auto p-3 md:grid md:p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex shrink-0 items-center gap-3 rounded-md border border-transparent px-4 py-3 text-sm font-bold text-accent/65 transition hover:border-white/10 hover:bg-white/5 hover:text-accent"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="hidden px-4 md:block">
        <div className="rounded-md border border-white/10 bg-background p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-accent text-background">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-black">30 day sprint</p>
              <p className="text-xs text-accent/45">Preview mode active</p>
            </div>
          </div>
          <p className="mt-4 text-xs leading-5 text-accent/55">
            Ship one faceless asset, one lead path, and one paid offer before adding complexity.
          </p>
        </div>
      </div>
    </aside>
  );
}
