"use client";

import Link from "next/link";
import { isValidElement, type ButtonHTMLAttributes, type ComponentProps, type ReactNode } from "react";
import { trackPrimaryCtaClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "outline";
};

export function Button({ className, variant = "solid", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-md px-6 text-center text-sm font-black uppercase tracking-normal transition duration-200 focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        variant === "solid" && "bg-htk-red text-white shadow-[0_14px_36px_rgba(225,29,46,0.22)] hover:scale-[1.02] hover:bg-red-500",
        variant === "outline" && "border border-htk-red/45 bg-black/20 text-accent hover:border-htk-red hover:bg-htk-red/10",
        variant === "ghost" && "text-accent hover:bg-htk-red/10 hover:text-white",
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  className?: string;
  variant?: "solid" | "ghost" | "outline";
  children: ReactNode;
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join(" ");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }

  return "";
}

function hrefToString(href: ButtonLinkProps["href"]) {
  if (typeof href === "string") {
    return href;
  }

  return href.pathname ?? "";
}

export function ButtonLink({
  className,
  variant = "solid",
  children,
  href,
  onClick,
  ...props
}: ButtonLinkProps) {
  const label = getTextContent(children);
  const trackedHref = hrefToString(href);

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-md px-6 text-center text-sm font-black uppercase tracking-normal transition duration-200 focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
        variant === "solid" && "bg-htk-red text-white shadow-[0_14px_36px_rgba(225,29,46,0.22)] hover:scale-[1.02] hover:bg-red-500",
        variant === "outline" && "border border-htk-red/45 bg-black/20 text-accent hover:border-htk-red hover:bg-htk-red/10",
        variant === "ghost" && "text-accent hover:bg-htk-red/10 hover:text-white",
        className
      )}
      onClick={(event) => {
        trackPrimaryCtaClick(label, trackedHref);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
