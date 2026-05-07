"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  suggestedReviewTags,
  type ReviewStatus
} from "@/lib/review-submission";
import { reviewStatuses } from "@/lib/review-submission";
import type { StoredReviewSubmission } from "@/lib/review-storage";
import { cn } from "@/lib/utils";

export function ReviewAdminControls({
  review
}: {
  review: StoredReviewSubmission;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ReviewStatus>(review.status);
  const [featured, setFeatured] = useState(review.featured);
  const [publicPermission, setPublicPermission] = useState(review.publicPermission);
  const [displayName, setDisplayName] = useState(review.displayName);
  const [rating, setRating] = useState(review.rating ? String(review.rating) : "");
  const [resultTags, setResultTags] = useState(review.resultTags.join(", "));
  const [message, setMessage] = useState("");

  function submit() {
    startTransition(async () => {
      setMessage("");

      const response = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          displayName,
          status,
          featured,
          publicPermission,
          rating: rating ? Number(rating) : null,
          resultTags
        })
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(result?.error ?? "Update failed.");
        return;
      }

      setMessage("Saved.");
      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#090909] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
      <p className="text-sm font-black uppercase text-red-400">Admin controls</p>
      <div className="mt-6 space-y-5">
        <Field label="Display name">
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="h-11 w-full rounded-md border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition focus:border-red-500/45"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as ReviewStatus)}
              className="h-11 w-full rounded-md border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition focus:border-red-500/45"
            >
              {reviewStatuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Rating">
            <select
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              className="h-11 w-full rounded-md border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition focus:border-red-500/45"
            >
              <option value="">No rating</option>
              {[1, 2, 3, 4, 5].map((option) => (
                <option key={option} value={option}>
                  {option} / 5
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Result tags">
          <input
            value={resultTags}
            onChange={(event) => setResultTags(event.target.value)}
            className="h-11 w-full rounded-md border border-white/10 bg-[#050505] px-4 text-sm text-white outline-none transition focus:border-red-500/45"
            placeholder="Explosiveness, Endurance, Mobility"
          />
          <p className="mt-2 text-xs leading-6 text-white/45">
            Suggested: {suggestedReviewTags.join(", ")}
          </p>
        </Field>

        <div className="grid gap-4">
          <CheckboxRow
            checked={featured}
            onChange={setFeatured}
            label="Feature this review on the public results page."
          />
          <CheckboxRow
            checked={publicPermission}
            onChange={setPublicPermission}
            label="Review has permission to be shown publicly."
          />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={isPending}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-500 px-5 text-sm font-black text-white shadow-[0_0_40px_rgba(220,38,38,0.28)] transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving" : "Save Review Settings"}
        </button>
        {message ? (
          <p
            className={cn(
              "text-sm leading-6",
              message === "Saved." ? "text-emerald-300" : "text-red-300"
            )}
          >
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-black text-white">{label}</span>
      {children}
    </label>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 rounded border-white/20 bg-[#050505] accent-red-500"
      />
      <span className="text-sm leading-6 text-white/68">{label}</span>
    </label>
  );
}
