import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs font-black uppercase text-accent/80",
        className
      )}
    >
      {children}
    </span>
  );
}
