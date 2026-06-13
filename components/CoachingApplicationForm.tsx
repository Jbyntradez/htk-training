"use client";

import { useRef, useState } from "react";
import { CtaLink } from "@/components/htk/CtaLink";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { event as analyticsEvent } from "@/lib/analytics";
import {
  coachingApplicationCommitmentLevels,
  coachingApplicationTimeFrames,
  type CoachingApplicationErrors,
  type CoachingApplicationPayload,
  validateCoachingApplicationPayload
} from "@/lib/coaching-application";
import { HTK_BOOKING_URL } from "@/lib/htk-config";
import { cn } from "@/lib/utils";

const initialState: CoachingApplicationPayload = {
  name: "",
  email: "",
  primaryGoal: "",
  currentState: "",
  nextPhaseGoal: "",
  timeFrame: "",
  commitmentLevel: "",
  source: "apply_page"
};

type SubmissionState = "idle" | "loading" | "success" | "error";

export function CoachingApplicationForm() {
  const [form, setForm] = useState<CoachingApplicationPayload>(initialState);
  const [errors, setErrors] = useState<CoachingApplicationErrors>({});
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");
  const assessmentStarted = useRef(false);

  function trackAssessmentStarted() {
    if (assessmentStarted.current) {
      return;
    }

    assessmentStarted.current = true;
    analyticsEvent("assessment_started", "Assessment Funnel", "Apply Page");
  }

  function updateField<Key extends keyof CoachingApplicationPayload>(
    key: Key,
    value: CoachingApplicationPayload[Key]
  ) {
    if (key !== "source" && typeof value === "string" && value.trim()) {
      trackAssessmentStarted();
    }

    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status !== "idle") {
      setStatus("idle");
      setMessage("");
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateCoachingApplicationPayload(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setStatus("error");
      setMessage("");
      return;
    }

    setStatus("loading");
    setErrors({});
    setMessage("");

    try {
      const response = await fetch("/api/coaching-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.payload)
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const fieldErrors = result?.fieldErrors ?? {};

        setStatus("error");
        setErrors(fieldErrors);
        setMessage(
          Object.keys(fieldErrors).length === 0
            ? result?.error ?? "Submission failed. Try again in a minute."
            : ""
        );
        return;
      }

      setStatus("success");
      analyticsEvent("assessment_completed", "Assessment Funnel", "Apply Page");
      setMessage("Application received. I will review it and reach out if coaching is the right fit.");
      setForm(initialState);
    } catch {
      setStatus("error");
      setMessage("Connection dropped. Submit again when you are ready.");
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#090909] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.34)] sm:p-7">
      <div className="border-b border-white/10 pb-6">
        <p className="text-sm font-black uppercase text-red-400">Apply for Coaching</p>
        <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
          Complete the short assessment.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62">
          Complete this short assessment so I can understand where you are, where you
          want to go, and whether coaching is the right fit.
        </p>
      </div>

      {status === "success" ? (
        <div className="py-8">
          <div className="rounded-lg border border-red-500/35 bg-red-500/[0.06] p-6">
            <p className="text-sm font-black uppercase text-red-300">Application sent</p>
            <p className="mt-3 text-2xl font-black text-white">You are in the queue.</p>
            <p className="mt-4 text-sm leading-7 text-white/68">{message}</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={HTK_BOOKING_URL}>
              Book a Consultation
            </CtaLink>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setMessage("");
              }}
              className="inline-flex min-h-14 items-center justify-center rounded-md border border-white/20 bg-white/[0.045] px-7 text-sm font-black text-white transition hover:border-red-500/50 hover:bg-red-500/[0.08]"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" error={errors.name}>
              <Input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
              />
            </Field>
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
          </div>

          <Field
            label="1. What is your primary fitness goal right now?"
            error={errors.primaryGoal}
          >
            <Textarea
              value={form.primaryGoal}
              onChange={(event) => updateField("primaryGoal", event.target.value)}
              placeholder="Strength, speed, endurance, body composition, performance, or another mission."
              aria-invalid={Boolean(errors.primaryGoal)}
            />
          </Field>

          <Field
            label="2. Where would you say you are currently, physically and mentally, in your fitness journey?"
            error={errors.currentState}
          >
            <Textarea
              value={form.currentState}
              onChange={(event) => updateField("currentState", event.target.value)}
              placeholder="Give a straight answer on your current condition, discipline, consistency, and how you are showing up."
              aria-invalid={Boolean(errors.currentState)}
            />
          </Field>

          <Field
            label="3. Where do you want to be over the next phase of your transformation?"
            error={errors.nextPhaseGoal}
          >
            <Textarea
              value={form.nextPhaseGoal}
              onChange={(event) => updateField("nextPhaseGoal", event.target.value)}
              placeholder="Describe the next version of your body, performance, and mindset."
              aria-invalid={Boolean(errors.nextPhaseGoal)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="4. What time frame are you aiming for to reach that next level?"
              error={errors.timeFrame}
            >
              <SelectField
                value={form.timeFrame}
                onChange={(event) => updateField("timeFrame", event.target.value as CoachingApplicationPayload["timeFrame"])}
                aria-invalid={Boolean(errors.timeFrame)}
              >
                <option value="">Choose a time frame</option>
                {coachingApplicationTimeFrames.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectField>
            </Field>

            <Field
              label="5. How committed are you to following a structured coaching plan?"
              error={errors.commitmentLevel}
            >
              <SelectField
                value={form.commitmentLevel}
                onChange={(event) =>
                  updateField(
                    "commitmentLevel",
                    event.target.value as CoachingApplicationPayload["commitmentLevel"]
                  )
                }
                aria-invalid={Boolean(errors.commitmentLevel)}
              >
                <option value="">Choose your level</option>
                {coachingApplicationCommitmentLevels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectField>
            </Field>
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
              Serious answers only. This application is reviewed before coaching spots are offered.
            </p>
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex min-h-14 items-center justify-center rounded-md bg-red-500 px-7 text-sm font-black text-white shadow-[0_0_40px_rgba(220,38,38,0.32)] transition hover:bg-red-400 hover:shadow-[0_0_54px_rgba(220,38,38,0.48)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "Submitting" : "Submit Application"}
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
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-sm font-black text-white">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-300">{error}</span> : null}
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
