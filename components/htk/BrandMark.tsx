import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  className
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)} aria-label="HTK Training home">
      <span className="grid size-10 place-items-center rounded-md border border-red-500/45 bg-red-500/10 text-sm font-black text-white shadow-[0_0_34px_rgba(220,38,38,0.28)]">
        HTK
      </span>
      <span className="leading-none">
        <span className="block text-base font-black uppercase">HTK</span>
        <span className="block text-[10px] font-bold uppercase text-white/60">Training</span>
      </span>
    </Link>
  );
}
