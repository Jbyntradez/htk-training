import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost" | "outline";
};

export function Button({ className, variant = "solid", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-md px-6 text-center text-sm font-bold uppercase tracking-normal transition duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        variant === "solid" && "bg-accent text-background hover:scale-[1.02] hover:bg-white",
        variant === "outline" && "border border-accent/30 text-accent hover:border-accent hover:bg-white/5",
        variant === "ghost" && "text-accent hover:bg-white/5",
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
        "inline-flex min-h-12 items-center justify-center rounded-md px-6 text-center text-sm font-bold uppercase tracking-normal transition duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
        variant === "solid" && "bg-accent text-background hover:scale-[1.02] hover:bg-white",
        variant === "outline" && "border border-accent/30 text-accent hover:border-accent hover:bg-white/5",
        variant === "ghost" && "text-accent hover:bg-white/5",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
