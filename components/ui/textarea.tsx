import { cn } from "@/lib/utils";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[124px] w-full rounded-md border border-white/10 bg-primary px-4 py-3 text-sm text-accent placeholder:text-accent/35 outline-none transition focus:border-accent/70",
        props.className
      )}
    />
  );
}
