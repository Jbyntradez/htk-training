import type { ReactNode } from "react";
import { Dumbbell } from "lucide-react";

export function HtkBadge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black uppercase text-white/70 shadow-[0_0_36px_rgba(220,38,38,0.12)] backdrop-blur">
      <Dumbbell className="mr-2 size-4 text-red-400" />
      {children}
    </div>
  );
}
