"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Activity, Loader2, ShieldCheck } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  athleteTrainingLevels,
  calculateBmi,
  type AthleteOnboardingErrors,
  type AthleteOnboardingPayload,
  type AthleteTrainingLevel,
  type AthleteUnitSystem
} from "@/lib/athlete-onboarding";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

type LoadState = "booting" | "ready" | "signed_out" | "error";

type OnboardingApiRecord = {
  fullName: string;
  age: number;
  unitSystem: AthleteUnitSystem;
  heightInches: number | null;
  heightCm: number | null;
  currentWeightLbs: number | null;
  currentWeightKg: number | null;
  primaryGoals: string;
  trainingLevel: AthleteTrainingLevel;
  injuriesCurrentPain: string | null;
  sport: string | null;
  weeklyAvailability: number;
  sessionDuration: number;
  equipmentAccess: string;
  clearedForExercise: boolean;
};

const initialForm: AthleteOnboardingPayload = {
  fullName: "",
  age: null,
  unitSystem: "lbs",
  height: null,
  currentWeight: null,
  primaryGoals: "",
  trainingLevel: "",
  injuriesCurrentPain: "",
  sport: "",
  weeklyAvailability: null,
  sessionDuration: null,
  equipmentAccess: "",
  clearedForExercise: null
};

function recordToForm(record: OnboardingApiRecord): AthleteOnboardingPayload {
  return {
    fullName: record.fullName,
    age: record.age,
    unitSystem: record.unitSystem,
    height: record.unitSystem === "lbs" ? record.heightInches : record.heightCm,
    currentWeight: record.unitSystem === "lbs" ? record.currentWeightLbs : record.currentWeightKg,
    primaryGoals: record.primaryGoals,
    trainingLevel: record.trainingLevel,
    injuriesCurrentPain: record.injuriesCurrentPain ?? "",
    sport: record.sport ?? "",
    weeklyAvailability: record.weeklyAvailability,
    sessionDuration: record.sessionDuration,
    equipmentAccess: record.equipmentAccess,
    clearedForExercise: record.clearedForExercise
  };
}

export function AthleteOnboardingForm() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<LoadState>("booting");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<AthleteOnboardingPayload>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<AthleteOnboardingErrors>({});
  const [saving, setSaving] = useState(false);

  const bmiPreview = useMemo(() => {
    if (!form.unitSystem || !form.height || !form.currentWeight || form.height <= 0) {
      return null;
    }

    try {
      if (form.unitSystem === "lbs") {
        return calculateBmi({
          unitSystem: "lbs",
          heightInches: form.height,
          currentWeightLbs: form.currentWeight
        });
      }

      return calculateBmi({
        unitSystem: "kg",
        heightCm: form.height,
        currentWeightKg: form.currentWeight
      });
    } catch {
      return null;
    }
  }, [form.currentWeight, form.height, form.unitSystem]);

  useEffect(() => {
    let active = true;

    async function boot() {
      try {
        const nextSupabase = createSupabaseBrowserClient();
        const { data } = await nextSupabase.auth.getSession();

        if (!active) {
          return;
        }

        setSupabase(nextSupabase);
        setSession(data.session);

        if (!data.session) {
          setStatus("signed_out");
          return;
        }

        const response = await fetch("/api/onboarding", {
          headers: {
            Authorization: `Bearer ${data.session.access_token}`
          },
          cache: "no-store"
        });
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          setStatus("error");
          setMessage(result?.error ?? "Could not load onboarding.");
          return;
        }

        if (result?.onboarding) {
          setForm(recordToForm(result.onboarding as OnboardingApiRecord));
        }

        setStatus("ready");
      } catch (error) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Onboarding failed to start.");
      }
    }

    void boot();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setStatus("signed_out");
      }
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  function updateField<Key extends keyof AthleteOnboardingPayload>(
    key: Key,
    value: AthleteOnboardingPayload[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
    setMessage("");
  }

  function updateUnitSystem(unitSystem: AthleteUnitSystem) {
    setForm((current) => ({
      ...current,
      unitSystem,
      height: null,
      currentWeight: null
    }));
    setFieldErrors((current) => ({
      ...current,
      unitSystem: undefined,
      height: undefined,
      currentWeight: undefined,
      bmi: undefined
    }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      setStatus("signed_out");
      return;
    }

    setSaving(true);
    setMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setFieldErrors(result?.fieldErrors ?? {});
        setMessage(result?.error ?? "Could not save onboarding.");
        setSaving(false);
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save onboarding.");
      setSaving(false);
    }
  }

  if (status === "booting") {
    return (
      <OnboardingShell>
        <div className="grid min-h-[50vh] place-items-center rounded-md border border-white/10 bg-primary p-8 text-center shadow-premium">
          <div>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent/60" />
            <p className="mt-5 text-sm font-black uppercase text-accent/45">Loading athlete intake</p>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  if (status === "signed_out") {
    return (
      <OnboardingShell>
        <div className="rounded-md border border-white/10 bg-primary p-8 shadow-premium">
          <p className="text-sm font-black uppercase text-accent/45">Sign in required</p>
          <h1 className="mt-3 text-4xl font-black">Open your athlete intake.</h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            Sign in or create an account before completing the HTK onboarding questionnaire.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/login" className="w-full sm:w-auto">Sign In</ButtonLink>
            <ButtonLink href="/signup" variant="outline" className="w-full sm:w-auto">Create Account</ButtonLink>
          </div>
        </div>
      </OnboardingShell>
    );
  }

  if (status === "error") {
    return (
      <OnboardingShell>
        <div className="rounded-md border border-white/10 bg-primary p-8 shadow-premium">
          <p className="text-sm font-black uppercase text-red-300">Onboarding unavailable</p>
          <h1 className="mt-3 text-4xl font-black">Something needs attention.</h1>
          <p className="mt-4 max-w-2xl text-accent/60">{message}</p>
          <ButtonLink href="/login" className="mt-6 w-full sm:w-auto">Back to Login</ButtonLink>
        </div>
      </OnboardingShell>
    );
  }

  const unitLabel = form.unitSystem === "lbs" ? "lbs / inches" : "kg / cm";
  const heightLabel = form.unitSystem === "lbs" ? "Height (inches)" : "Height (cm)";
  const weightLabel = form.unitSystem === "lbs" ? "Current weight (lbs)" : "Current weight (kg)";

  return (
    <OnboardingShell action={<SignOutButton />}>
      <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <aside className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
          <div className="grid size-12 place-items-center rounded-md bg-accent text-background">
            <Activity className="h-5 w-5" />
          </div>
          <p className="mt-6 text-sm font-black uppercase text-accent/45">Athlete onboarding</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">Build your HTK baseline.</h1>
          <p className="mt-4 text-sm leading-7 text-accent/60">
            This intake gives the platform enough signal to personalize the dashboard without building a full workout library yet.
          </p>
          <div className="mt-6 rounded-md border border-white/10 bg-background p-4">
            <p className="text-xs font-black uppercase text-accent/40">BMI preview</p>
            <p className="mt-2 text-4xl font-black">{bmiPreview ?? "--"}</p>
            <p className="mt-2 text-xs leading-5 text-accent/50">
              Calculated live from {unitLabel}. The server recalculates before saving.
            </p>
          </div>
        </aside>

        <form onSubmit={submit} className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
          <div className="border-b border-white/10 pb-6">
            <p className="text-sm font-black uppercase text-accent/45">Profile details</p>
            <h2 className="mt-3 text-3xl font-black">Tell us what body we are building.</h2>
          </div>

          <div className="mt-6 grid gap-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Full name" error={fieldErrors.fullName}>
                <Input
                  value={form.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </Field>
              <Field label="Age" error={fieldErrors.age}>
                <Input
                  type="number"
                  min={13}
                  max={100}
                  value={form.age ?? ""}
                  onChange={(event) => updateField("age", numberOrNull(event.target.value))}
                  placeholder="28"
                />
              </Field>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-accent/75">Unit system</p>
              <div className="grid grid-cols-2 gap-3">
                {(["lbs", "kg"] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => updateUnitSystem(unit)}
                    className={`min-h-11 rounded-md border px-4 text-sm font-black uppercase transition ${
                      form.unitSystem === unit
                        ? "border-accent bg-accent text-background"
                        : "border-white/10 bg-background text-accent/65 hover:border-white/25 hover:text-accent"
                    }`}
                  >
                    {unit === "lbs" ? "Lbs / Inches" : "Kg / Cm"}
                  </button>
                ))}
              </div>
              {fieldErrors.unitSystem ? <p className="mt-2 text-sm text-red-300">{fieldErrors.unitSystem}</p> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={heightLabel} error={fieldErrors.height}>
                <Input
                  type="number"
                  min={form.unitSystem === "lbs" ? 36 : 90}
                  max={form.unitSystem === "lbs" ? 96 : 245}
                  step="0.1"
                  value={form.height ?? ""}
                  onChange={(event) => updateField("height", numberOrNull(event.target.value))}
                  placeholder={form.unitSystem === "lbs" ? "70" : "178"}
                />
              </Field>
              <Field label={weightLabel} error={fieldErrors.currentWeight}>
                <Input
                  type="number"
                  min={form.unitSystem === "lbs" ? 50 : 25}
                  max={form.unitSystem === "lbs" ? 700 : 320}
                  step="0.1"
                  value={form.currentWeight ?? ""}
                  onChange={(event) => updateField("currentWeight", numberOrNull(event.target.value))}
                  placeholder={form.unitSystem === "lbs" ? "185" : "84"}
                />
              </Field>
            </div>
            {fieldErrors.bmi ? <p className="text-sm text-red-300">{fieldErrors.bmi}</p> : null}

            <Field label="Primary goals" error={fieldErrors.primaryGoals}>
              <Textarea
                value={form.primaryGoals}
                onChange={(event) => updateField("primaryGoals", event.target.value)}
                placeholder="Strength, conditioning, body composition, speed, sport performance, resilience..."
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Training level" error={fieldErrors.trainingLevel}>
                <select
                  value={form.trainingLevel}
                  onChange={(event) =>
                    updateField("trainingLevel", event.target.value as AthleteOnboardingPayload["trainingLevel"])
                  }
                  className="h-11 w-full rounded-md border border-white/10 bg-primary px-4 text-sm text-accent outline-none transition focus:border-accent/70"
                >
                  <option value="">Choose level</option>
                  {athleteTrainingLevels.map((level) => (
                    <option key={level} value={level}>
                      {level[0].toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Sport" error={fieldErrors.sport}>
                <Input
                  value={form.sport}
                  onChange={(event) => updateField("sport", event.target.value)}
                  placeholder="Football, combat sport, tactical, none..."
                />
              </Field>
            </div>

            <Field label="Injuries/current pain" error={fieldErrors.injuriesCurrentPain}>
              <Textarea
                value={form.injuriesCurrentPain}
                onChange={(event) => updateField("injuriesCurrentPain", event.target.value)}
                placeholder="Current pain, limitations, old injuries, or no current pain."
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Weekly availability" error={fieldErrors.weeklyAvailability}>
                <Input
                  type="number"
                  min={1}
                  max={14}
                  value={form.weeklyAvailability ?? ""}
                  onChange={(event) => updateField("weeklyAvailability", numberOrNull(event.target.value))}
                  placeholder="4"
                />
              </Field>
              <Field label="Session duration (minutes)" error={fieldErrors.sessionDuration}>
                <Input
                  type="number"
                  min={15}
                  max={180}
                  value={form.sessionDuration ?? ""}
                  onChange={(event) => updateField("sessionDuration", numberOrNull(event.target.value))}
                  placeholder="60"
                />
              </Field>
            </div>

            <Field label="Equipment access" error={fieldErrors.equipmentAccess}>
              <Textarea
                value={form.equipmentAccess}
                onChange={(event) => updateField("equipmentAccess", event.target.value)}
                placeholder="Full gym, dumbbells, field, bands, home setup, no equipment..."
              />
            </Field>

            <div>
              <p className="mb-3 text-sm font-bold text-accent/75">Cleared for exercise</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false }
                ].map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => updateField("clearedForExercise", option.value)}
                    className={`min-h-11 rounded-md border px-4 text-sm font-black uppercase transition ${
                      form.clearedForExercise === option.value
                        ? "border-accent bg-accent text-background"
                        : "border-white/10 bg-background text-accent/65 hover:border-white/25 hover:text-accent"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {fieldErrors.clearedForExercise ? (
                <p className="mt-2 text-sm text-red-300">{fieldErrors.clearedForExercise}</p>
              ) : null}
            </div>

            {message ? <p className="text-sm leading-6 text-red-300">{message}</p> : null}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-6 text-accent/45">
                This is a baseline, not a diagnosis. Enter honest numbers so the dashboard can track the right signal.
              </p>
              <Button type="submit" disabled={saving} className="w-full sm:w-auto">
                {saving ? "Saving" : "Complete Onboarding"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </OnboardingShell>
  );
}

function OnboardingShell({
  children,
  action
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-accent">
      <header className="border-b border-white/10 bg-primary">
        <div className="container-px mx-auto flex h-20 max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase">HTK Operator</p>
            <p className="mt-1 text-xs uppercase text-accent/40">Athlete intake</p>
          </div>
          <div className="flex items-center gap-3">
            {action}
            <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-background px-3 py-2 text-xs font-black uppercase text-accent/50 sm:flex">
              <ShieldCheck className="h-4 w-4" />
              Secure intake
            </div>
          </div>
        </div>
      </header>
      <div className="container-px mx-auto max-w-7xl py-8 md:py-12">
        {children}
      </div>
    </main>
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
      <span className="mb-2 block text-sm font-bold text-accent/75">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-300">{error}</span> : null}
    </label>
  );
}

function numberOrNull(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}
