import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Microcopy({
  label,
  description,
  icon,
  id,
  align = "left",
  className,
  summaryClassName
}: {
  label: string;
  description: string;
  icon?: ReactNode;
  id?: string;
  align?: "left" | "right";
  className?: string;
  summaryClassName?: string;
}) {
  const tooltipId = id ?? `tip-${slug(label)}-${slug(description).slice(0, 24)}`;

  return (
    <details className={cn("htk-microcopy group relative inline-flex", className)}>
      <summary
        aria-describedby={tooltipId}
        title={description}
        className={cn(
          "inline-flex cursor-help list-none items-center gap-2 rounded-md border border-white/10 bg-black/35 px-2.5 py-1.5 text-xs font-black uppercase text-accent/75 transition hover:border-htk-red/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background [&::-webkit-details-marker]:hidden",
          summaryClassName
        )}
      >
        <span className="text-htk-red">{icon ?? <Info className="h-3.5 w-3.5" />}</span>
        {label}
      </summary>
      <span
        id={tooltipId}
        role="tooltip"
        className={cn(
          "htk-microcopy-panel absolute top-[calc(100%+0.5rem)] z-30 w-72 rounded-md border border-htk-red/25 bg-[#090909] p-3 text-left text-xs font-bold normal-case leading-5 text-accent/75 shadow-[0_18px_50px_rgba(0,0,0,0.5)]",
          align === "right" ? "right-0" : "left-0"
        )}
      >
        {description}
      </span>
    </details>
  );
}
