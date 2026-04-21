import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  variant?: "primary" | "secondary";
  size?: "sm" | "base" | "card";
};

const sizeClasses: Record<NonNullable<CtaLinkProps["size"]>, string> = {
  sm: "min-h-11 px-5",
  base: "min-h-14 px-7",
  card: "min-h-12 px-5"
};

export function CtaLink({
  href,
  children,
  className,
  external = false,
  variant = "primary",
  size = "base"
}: CtaLinkProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md text-sm font-black transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#050505]",
    sizeClasses[size],
    variant === "primary"
      ? "bg-red-500 text-white shadow-[0_0_40px_rgba(220,38,38,0.35)] hover:bg-red-400 hover:shadow-[0_0_54px_rgba(220,38,38,0.5)]"
      : "border border-white/20 bg-white/[0.045] text-white hover:border-red-500/50 hover:bg-red-500/[0.08]",
    className
  );

  const content = (
    <>
      {children}
      <ArrowRight className="ml-2 size-4" />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
