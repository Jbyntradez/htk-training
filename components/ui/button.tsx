import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  className?: string;
  variant?: "solid" | "ghost" | "outline";
  children: React.ReactNode;
};

export function ButtonLink({ className, variant = "solid", children, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-md px-6 text-center text-sm font-black uppercase tracking-normal transition duration-200 focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
        variant === "solid" && "bg-htk-red text-white shadow-[0_14px_36px_rgba(225,29,46,0.22)] hover:scale-[1.02] hover:bg-red-500",
        variant === "outline" && "border border-htk-red/45 bg-black/20 text-accent hover:border-htk-red hover:bg-htk-red/10",
        variant === "ghost" && "text-accent hover:bg-htk-red/10 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
