import { cn } from "@/lib/utils";
import type { ReviewStatus } from "@/lib/review-submission";

const styles: Record<ReviewStatus, string> = {
  pending: "border-amber-400/25 bg-amber-500/[0.08] text-amber-200",
  approved: "border-emerald-400/25 bg-emerald-500/[0.08] text-emerald-200",
  rejected: "border-red-400/25 bg-red-500/[0.08] text-red-200"
};

export function ReviewStatusPill({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        styles[status]
      )}
    >
      {status}
    </span>
  );
}
