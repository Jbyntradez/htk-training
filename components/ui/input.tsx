import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-md border border-white/10 bg-black/35 px-4 text-sm text-accent placeholder:text-accent/35 outline-none transition focus:border-htk-red/80 focus:bg-black/50",
        props.className
      )}
    />
  );
}
