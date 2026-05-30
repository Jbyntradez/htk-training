"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Activity, CheckCircle2, Dumbbell, Loader2, ShieldAlert, Target, Timer } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { Button, ButtonLink } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { canManagePlatform } from "@/lib/role-permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type {
  AthleteOnboardingSummary,
  DailyCheckIn,
  TodayDashboardState,
  TodayTrainingAssignment
} from "@/lib/operator-platform-types";

type LoadState = "booting" | "loading" | "ready" | "signed_out" | "access_required" | "error";

export function HtkDashboardClient() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [dashboard, setDashboard] = useState<TodayDashboardState | null>(null);
  const [status, setStatus] = useState<LoadState>("booting");
  const [message, setMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const loadDashboard = useCallback(async (accessToken: string) => {
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/dashboard/today", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus(
        response.status === 401
          ? "signed_out"
          : response.status === 402
            ? "access_required"
            : "error"
      );
      setMessage(result?.error ?? "Could not load your dashboard.");
      return;
    }

    setDashboard(result as TodayDashboardState);
    setStatus("ready");
  }, []);

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

        await loadDashboard(data.session.access_token);
      } catch (error) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Dashboard failed to start.");
      }
    }

    void boot();

    return () => {
      active = false;
    };
  }, [loadDashboard]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setDashboard(null);
        setStatus("signed_out");
      }
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  async function refresh() {
    if (!session) {
      setStatus("signed_out");
      return;
    }

    await loadDashboard(session.access_token);
  }

  async function submitCheckIn(payload: CheckInFormPayload) {
    if (!session) {
      setStatus("signed_out");
      return;
    }

    const response = await fetch("/api/dashboard/check-in", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error ?? "Could not save check-in.");
    }

    await refresh();
  }

  async function completeTraining(payload: TrainingCompletionPayload) {
    if (!session) {
      setStatus("signed_out");
      return;
    }

    const response = await fetch("/api/dashboard/training", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error ?? "Could not complete training.");
    }

    await refresh();
  }

  async function startMembership() {
    if (!session) {
      setStatus("signed_out");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.url) {
        throw new Error(result?.error ?? "Could not start checkout.");
      }

      window.location.assign(result.url);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Could not start checkout.");
      setCheckoutLoading(false);
    }
  }

  if (status === "booting" || status === "loading") {
    return (
      <DashboardShell>
        <div className="grid min-h-[50vh] place-items-center rounded-md border border-white/10 bg-primary p-8 text-center">
          <div>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent/60" />
            <p className="mt-5 text-sm font-black uppercase text-accent/45">Loading operator data</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (status === "signed_out") {
    return (
      <DashboardShell>
        <div className="rounded-md border border-white/10 bg-primary p-8 shadow-premium">
          <p className="text-sm font-black uppercase text-accent/45">Sign in required</p>
          <h1 className="mt-3 text-4xl font-black">Open your HTK dashboard.</h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            {message || "Use your Supabase Auth account to load today's assigned training and check-in."}
          </p>
          <ButtonLink href="/login" className="mt-6 w-full sm:w-auto">
            Sign In
          </ButtonLink>
        </div>
      </DashboardShell>
    );
  }

  if (status === "access_required") {
    return (
      <DashboardShell userAction={<SignOutButton />}>
        <div className="rounded-md border border-white/10 bg-primary p-8 shadow-premium">
          <ShieldAlert className="h-7 w-7 text-accent/55" />
          <p className="mt-5 text-sm font-black uppercase text-accent/45">Access required</p>
          <h1 className="mt-3 text-4xl font-black">Your HTK dashboard is locked.</h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            {message || "Paid access is required before training, check-ins, and assigned sessions unlock."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={startMembership} disabled={checkoutLoading} className="w-full sm:w-auto">
              {checkoutLoading ? "Opening Checkout" : "Start Membership"}
            </Button>
            <Button onClick={refresh} variant="outline" className="w-full sm:w-auto">
              Refresh
            </Button>
          </div>
          {checkoutError ? <p className="mt-4 text-sm text-red-300">{checkoutError}</p> : null}
        </div>
      </DashboardShell>
    );
  }

  if (status === "error" || !dashboard) {
    return (
      <DashboardShell>
        <div className="rounded-md border border-white/10 bg-primary p-8 shadow-premium">
          <ShieldAlert className="h-7 w-7 text-red-300" />
          <p className="mt-5 text-sm font-black uppercase text-accent/45">Dashboard unavailable</p>
          <h1 className="mt-3 text-4xl font-black">Something needs attention.</h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            {message || "Could not load the HTK operator platform."}
          </p>
          <Button onClick={refresh} className="mt-6 w-full sm:w-auto">
            Try Again
          </Button>
        </div>
      </DashboardShell>
    );
  }

  const readiness = dashboard.checkIn?.readinessScore ?? 0;
  const trainingComplete = dashboard.assignment.status === "completed";

  return (
    <DashboardShell
      user={dashboard.profile}
      userAction={
        <div className="flex items-center gap-2">
          {canManagePlatform(dashboard.profile.role) ? (
            <ButtonLink href="/admin" variant="outline" className="min-h-10 px-4 text-xs">
              Admin Panel
            </ButtonLink>
          ) : null}
          <SignOutButton />
        </div>
      }
    >
      <div className="grid gap-6 rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Today&apos;s HTK loop</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
            Train with intent, {dashboard.profile.name}.
          </h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            Check readiness, complete the assigned work, and save the signal your coach needs next.
          </p>
        </div>
        <ProgressRing percent={readiness} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SignalCard
          icon={Activity}
          label="Readiness"
          value={dashboard.checkIn ? `${dashboard.checkIn.readinessScore}%` : "Needed"}
        />
        <SignalCard
          icon={Dumbbell}
          label="Training"
          value={trainingComplete ? "Complete" : "Assigned"}
        />
        <SignalCard icon={Timer} label="Date" value={dashboard.today} />
      </div>

      <AthleteSummaryCard onboarding={dashboard.onboarding} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <TodayTrainingCard assignment={dashboard.assignment} onComplete={completeTraining} />
        <DailyCheckInForm checkIn={dashboard.checkIn} onSubmit={submitCheckIn} />
      </div>
    </DashboardShell>
  );
}

function AthleteSummaryCard({
  onboarding
}: {
  onboarding: AthleteOnboardingSummary | null;
}) {
  if (!onboarding) {
    return (
      <section className="mt-8 rounded-md border border-white/10 bg-primary p-6 shadow-premium">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-accent/45">Athlete profile</p>
            <h2 className="mt-3 text-3xl font-black">Complete your HTK baseline.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-accent/60">
              Your onboarding summary will personalize this dashboard once it is saved.
            </p>
          </div>
          <ButtonLink href="/onboarding" className="w-full sm:w-auto">
            Complete Onboarding
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-md border border-white/10 bg-primary p-6 shadow-premium">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Athlete profile</p>
          <h2 className="mt-3 text-3xl font-black">{onboarding.fullName}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-accent/62">
            {onboarding.primaryGoals}
          </p>
        </div>
        <div className="grid size-16 place-items-center rounded-md border border-white/10 bg-background">
          <Target className="h-7 w-7 text-accent/55" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryItem label="Training level" value={formatTrainingLevel(onboarding.trainingLevel)} />
        <SummaryItem label="Sport" value={onboarding.sport || "General performance"} />
        <SummaryItem label="BMI" value={onboarding.bmi.toFixed(2)} />
        <SummaryItem label="Weekly availability" value={`${onboarding.weeklyAvailability} sessions`} />
        <SummaryItem label="Session duration" value={`${onboarding.sessionDuration} min`} />
        <SummaryItem label="Equipment access" value={onboarding.equipmentAccess} wide />
      </div>
    </section>
  );
}

function SummaryItem({
  label,
  value,
  wide = false
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-md border border-white/10 bg-background p-4 ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}>
      <p className="text-xs font-black uppercase text-accent/40">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-accent/78">{value}</p>
    </div>
  );
}

function formatTrainingLevel(level: AthleteOnboardingSummary["trainingLevel"]) {
  return level[0].toUpperCase() + level.slice(1);
}

function SignalCard({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-primary p-5">
      <Icon className="h-5 w-5 text-accent/45" />
      <p className="mt-4 text-xs font-black uppercase text-accent/40">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

type TrainingCompletionPayload = {
  assignmentId: string;
  clientNotes: string;
};

function TodayTrainingCard({
  assignment,
  onComplete
}: {
  assignment: TodayTrainingAssignment;
  onComplete: (payload: TrainingCompletionPayload) => Promise<void>;
}) {
  const [clientNotes, setClientNotes] = useState(assignment.clientNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const complete = assignment.status === "completed";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onComplete({
        assignmentId: assignment.id,
        clientNotes
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not complete training.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Assigned training</p>
          <h2 className="mt-3 text-3xl font-black">{assignment.title}</h2>
        </div>
        {complete ? <CheckCircle2 className="h-7 w-7 shrink-0" /> : <Dumbbell className="h-7 w-7 shrink-0 text-accent/45" />}
      </div>
      <p className="mt-4 text-sm leading-6 text-accent/62">{assignment.description}</p>
      <div className="mt-6 grid gap-3 border-y border-white/10 py-5 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase text-accent/40">Focus</p>
          <p className="mt-2 font-bold">{assignment.focus}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase text-accent/40">Estimated time</p>
          <p className="mt-2 font-bold">{assignment.estimatedMinutes} min</p>
        </div>
      </div>
      {complete ? (
        <div className="mt-6 rounded-md border border-white/10 bg-background p-4">
          <p className="text-sm font-black uppercase text-accent/45">Saved complete</p>
          <p className="mt-2 text-sm leading-6 text-accent/65">
            {assignment.clientNotes || "Training marked complete. No notes added."}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label>
            <span className="mb-2 block text-sm font-bold text-accent/75">Training notes</span>
            <Textarea
              value={clientNotes}
              onChange={(event) => setClientNotes(event.target.value)}
              placeholder="Output, fatigue, pain signals, wins, or anything your coach should know."
            />
          </label>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving" : "Mark Training Complete"}
          </Button>
        </form>
      )}
    </section>
  );
}

type CheckInFormPayload = {
  sleepQuality: number;
  energy: number;
  soreness: number;
  stress: number;
  painFlag: boolean;
  bodyNotes: string;
};

function DailyCheckInForm({
  checkIn,
  onSubmit
}: {
  checkIn: DailyCheckIn | null;
  onSubmit: (payload: CheckInFormPayload) => Promise<void>;
}) {
  const [sleepQuality, setSleepQuality] = useState(checkIn?.sleepQuality ?? 3);
  const [energy, setEnergy] = useState(checkIn?.energy ?? 3);
  const [soreness, setSoreness] = useState(checkIn?.soreness ?? 3);
  const [stress, setStress] = useState(checkIn?.stress ?? 3);
  const [painFlag, setPainFlag] = useState(checkIn?.painFlag ?? false);
  const [bodyNotes, setBodyNotes] = useState(checkIn?.bodyNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await onSubmit({
        sleepQuality,
        energy,
        soreness,
        stress,
        painFlag,
        bodyNotes
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save check-in.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Daily check-in</p>
          <h2 className="mt-3 text-3xl font-black">
            {checkIn ? `${checkIn.readinessScore}% readiness` : "Report readiness"}
          </h2>
        </div>
        <Activity className="h-7 w-7 shrink-0 text-accent/45" />
      </div>
      <form onSubmit={submit} className="mt-6 grid gap-5">
        <RatingField label="Sleep quality" value={sleepQuality} onChange={setSleepQuality} />
        <RatingField label="Energy" value={energy} onChange={setEnergy} />
        <RatingField label="Soreness" value={soreness} onChange={setSoreness} />
        <RatingField label="Stress" value={stress} onChange={setStress} />
        <label className="flex items-center gap-3 rounded-md border border-white/10 bg-background p-4 text-sm font-bold text-accent/70">
          <input
            type="checkbox"
            checked={painFlag}
            onChange={(event) => setPainFlag(event.target.checked)}
            className="h-4 w-4 accent-white"
          />
          Pain or injury flag today
        </label>
        <label>
          <span className="mb-2 block text-sm font-bold text-accent/75">Body notes</span>
          <Textarea
            value={bodyNotes}
            onChange={(event) => setBodyNotes(event.target.value)}
            placeholder="Sleep, soreness, motivation, pain, or recovery notes."
          />
        </label>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? "Saving" : checkIn ? "Update Check-In" : "Submit Check-In"}
        </Button>
      </form>
    </section>
  );
}

function RatingField({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <span className="mb-2 flex items-center justify-between text-sm font-bold text-accent/75">
        {label}
        <span className="text-accent">{value}/5</span>
      </span>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-white"
      />
    </label>
  );
}
