import Link from "next/link";
import { cn } from "@/lib/utils";

export function HtkWordmark({
  href = "/",
  label = "HTK Training home",
  eyebrow = "Training",
  compact = false,
  className
}: {
  href?: string;
  label?: string;
  eyebrow?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
        className
      )}
    >
      <span
        className={cn(
          "grid place-items-center rounded-md border border-htk-red/45 bg-htk-red/10 font-black text-white shadow-[0_0_34px_rgba(225,29,46,0.25)]",
          compact ? "size-9 text-xs" : "size-10 text-sm"
        )}
      >
        HTK
      </span>
      <span className="leading-none">
        <span className={cn("block font-black uppercase text-accent", compact ? "text-sm" : "text-base")}>HTK</span>
        <span className="block text-[10px] font-bold uppercase text-htk-muted">{eyebrow}</span>
      </span>
    </Link>
  );
}
