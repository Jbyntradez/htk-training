"use client";

import { useMemo, useState, type ReactNode } from "react";
import { CtaLink } from "@/components/htk/CtaLink";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  reviewRatingOptions,
  type ReviewSubmissionErrors,
  validateReviewSubmissionPayload
} from "@/lib/review-submission";
import { HTK_BOOKING_URL } from "@/lib/htk-config";
import { cn } from "@/lib/utils";

type SubmissionState = "idle" | "loading" | "success" | "error";

type ReviewFormState = {
  fullName: string;
  displayName: string;
  email: string;
  athleteType: string;
  trainingWithHtk: string;
  challengeBefore: string;
  resultImprovement: string;
  testimonialQuote: string;
  rating: string;
  publicPermission: boolean;
  wantsVideoTestimonial: boolean;
  media: File | null;
};

const initialState: ReviewFormState = {
  fullName: "",
  displayName: "",
  email: "",
  athleteType: "",
  trainingWithHtk: "",
  challengeBefore: "",
  resultImprovement: "",
  testimonialQuote: "",
  rating: "",
  publicPermission: false,
  wantsVideoTestimonial: false,
  media: null
};

export function ReviewSubmissionForm() {
  const [form, setForm] = useState<ReviewFormState>(initialState);
  const [errors, setErrors] = useState<ReviewSubmissionErrors>({});
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  const selectedFileLabel = useMemo(
    () => (form.media ? form.media.name : "Optional image or screenshot"),
    [form.media]
  );

  function updateField<Key extends keyof ReviewFormState>(key: Key, value: ReviewFormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key as keyof ReviewSubmissionErrors]: undefined }));

    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateReviewSubmissionPayload({
      fullName: form.fullName,
      displayName: form.displayName,
      email: form.email,
      athleteType: form.athleteType,
      trainingWithHtk: form.trainingWithHtk,
      challengeBefore: form.challengeBefore,
      resultImprovement: form.resultImprovement,
      testimonialQuote: form.testimonialQuote,
      rating: form.rating,
      publicPermission: form.publicPermission,
      wantsVideoTestimonial: form.wantsVideoTestimonial
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setStatus("error");
      setMessage("");
      return;
    }

    setStatus("loading");
    setErrors({});
    setMessage("");

    const payload = new FormData();
    payload.set("fullName", form.fullName);
    payload.set("displayName", form.displayName);
    payload.set("email", form.email);
    payload.set("athleteType", form.athleteType);
    payload.set("trainingWithHtk", form.trainingWithHtk);
    payload.set("challengeBefore", form.challengeBefore);
    payload.set("resultImprovement", form.resultImprovement);
    payload.set("testimonialQuote", form.testimonialQuote);
    payload.set("rating", form.rating);

    if (form.publicPermission) {
      payload.set("publicPermission", "true");
    }

    if (form.wantsVideoTestimonial) {
      payload.set("wantsVideoTestimonial", "true");
    }

    if (form.media) {
      payload.set("media", form.media);
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        body: payload
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const fieldErrors = result?.fieldErrors ?? {};

        setStatus("error");
        setErrors(fieldErrors);
        setMessage(
          Object.keys(fieldErrors).length === 0
            ? result?.error ?? "Review submission failed. Try again in a minute."
            : ""
        );
        return;
      }

      setStatus("success");
      setMessage(
        "Review received. Thank you for taking the time to document the work and the result."
      );
      setForm(initialState);
    } catch {
      setStatus("error");
      setMessage("Connection dropped. Submit again when you are ready.");
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#090909] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.34)] sm:p-7">
      <div className="border-b border-white/10 pb-6">
        <p className="text-sm font-black uppercase text-red-400">HTK review intake</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Submit a review with intent.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
          This form is built to capture real client proof that can be reviewed, approved,
          and turned into legitimate social proof for HTK Training.
        </p>
      </div>

      {status === "success" ? (
        <div className="py-8">
          <div className="rounded-lg border border-red-500/35 bg-red-500/[0.06] p-6">
            <p className="text-sm font-black uppercase text-red-300">Review received</p>
            <p className="mt-3 text-2xl font-black text-white">Your feedback is in the queue.</p>
            <p className="mt-4 text-sm leading-7 text-white/68">{message}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CtaLink href="/results" variant="secondary">
              View Results
            </CtaLink>
            <CtaLink href={HTK_BOOKING_URL} external>
              Book a Consultation
            </CtaLink>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.fullName}>
              <Input
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
              />
            </Field>
            <Field label="Display name or initials" error={errors.displayName}>
              <Input
                value={form.displayName}
                onChange={(event) => updateField("displayName", event.target.value)}
                placeholder="How HTK can display your review"
                aria-invalid={Boolean(errors.displayName)}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
            </Field>
            <Field label="Athlete type / background" error={errors.athleteType}>
              <Input
                value={form.athleteType}
                onChange={(event) => updateField("athleteType", event.target.value)}
                placeholder="Athlete, operator, former athlete, high performer"
                aria-invalid={Boolean(errors.athleteType)}
              />
            </Field>
          </div>

          <Field label="How did you train with HTK?" error={errors.trainingWithHtk}>
            <Textarea
              value={form.trainingWithHtk}
              onChange={(event) => updateField("trainingWithHtk", event.target.value)}
              placeholder="1:1 coaching, consultation, remote block, performance plan, or another format."
              aria-invalid={Boolean(errors.trainingWithHtk)}
            />
          </Field>

          <Field label="Biggest challenge before HTK" error={errors.challengeBefore}>
            <Textarea
              value={form.challengeBefore}
              onChange={(event) => updateField("challengeBefore", event.target.value)}
              placeholder="Where were you stuck before the coaching or structure clicked?"
              aria-invalid={Boolean(errors.challengeBefore)}
            />
          </Field>

          <Field label="Result or improvement you experienced" error={errors.resultImprovement}>
            <Textarea
              value={form.resultImprovement}
              onChange={(event) => updateField("resultImprovement", event.target.value)}
              placeholder="What changed in your body, output, conditioning, recovery, or confidence?"
              aria-invalid={Boolean(errors.resultImprovement)}
            />
          </Field>

          <Field label="Testimonial quote" error={errors.testimonialQuote}>
            <Textarea
              value={form.testimonialQuote}
              onChange={(event) => updateField("testimonialQuote", event.target.value)}
              placeholder="Write the quote you would want HTK to consider publishing."
              aria-invalid={Boolean(errors.testimonialQuote)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rating (optional)">
              <SelectField
                value={form.rating}
                onChange={(event) => updateField("rating", event.target.value)}
              >
                <option value="">No rating selected</option>
                {reviewRatingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} / 5
                  </option>
                ))}
              </SelectField>
            </Field>
            <Field label="Optional upload" error={errors.media}>
              <label className="flex min-h-11 cursor-pointer items-center justify-between rounded-md border border-white/10 bg-primary px-4 text-sm text-accent transition hover:border-red-500/45">
                <span className="truncate pr-4 text-white/68">{selectedFileLabel}</span>
                <span className="text-xs font-black uppercase text-red-300">Choose file</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) =>
                    updateField("media", event.target.files?.[0] ?? null)
                  }
                />
              </label>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <CheckboxField
              checked={form.publicPermission}
              onChange={(checked) => updateField("publicPermission", checked)}
              label="HTK has permission to display this review publicly."
              helper="Leave this unchecked if you want the review to stay private/internal."
            />
            <CheckboxField
              checked={form.wantsVideoTestimonial}
              onChange={(checked) => updateField("wantsVideoTestimonial", checked)}
              label="I am open to being contacted for a video testimonial."
              helper="Optional. This simply lets HTK know you are available."
            />
          </div>

          {message ? (
            <p
              className={cn(
                "text-sm leading-6",
                status === "error" ? "text-red-300" : "text-white/68"
              )}
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-white/45">
              Clear feedback only. This form is reviewed internally before anything is
              published.
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-14 items-center justify-center rounded-md bg-red-500 px-7 text-sm font-black text-white shadow-[0_0_40px_rgba(220,38,38,0.32)] transition hover:bg-red-400 hover:shadow-[0_0_54px_rgba(220,38,38,0.48)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Submitting" : "Submit Review"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-black text-white">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-300">{error}</span> : null}
    </label>
  );
}

function CheckboxField({
  checked,
  onChange,
  label,
  helper
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  helper: string;
}) {
  return (
    <label className="rounded-lg border border-white/10 bg-white/[0.035] p-4 transition hover:border-red-500/35">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 size-4 rounded border-white/20 bg-[#050505] accent-red-500"
        />
        <div>
          <p className="text-sm font-black text-white">{label}</p>
          <p className="mt-2 text-sm leading-6 text-white/58">{helper}</p>
        </div>
      </div>
    </label>
  );
}

function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 w-full rounded-md border border-white/10 bg-primary px-4 text-sm text-accent outline-none transition focus:border-accent/70",
        props.className
      )}
    />
  );
}
