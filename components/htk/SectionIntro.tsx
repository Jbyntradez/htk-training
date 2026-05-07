import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionIntro({
  eyebrow,
  title,
  body,
  align = "center",
  children
}: {
  eyebrow: string;
  title: string;
  body: string;
  align?: "center" | "left";
  children?: ReactNode;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl")}>
      <p className="text-sm font-black uppercase text-red-400">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-white/60">{body}</p>
      {children}
    </div>
  );
}
