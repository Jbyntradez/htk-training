"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  Activity,
  AlertTriangle,
  CalendarPlus,
  ChevronRight,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Filter,
  Loader2,
  Search,
  ShieldAlert,
  Target,
  UserCheck,
  Users,
  XCircle
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { UserIdentityBadge, ViewStatusBadge } from "@/components/dashboard/UserIdentityBadge";
import { HtkWordmark } from "@/components/htk/HtkWordmark";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { canManagePlatform } from "@/lib/role-permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import type {
  AthleteTrainingLevel,
  CoachAthleteDetail,
  CoachAthleteListItem,
  CoachAthleteOnboardingProfile,
  CoachCheckInHistoryItem,
  CoachProfile,
  CoachTrainingHistoryItem,
  TrainingStatus
} from "@/lib/coach-platform-types";

type LoadState = "booting" | "loading" | "ready" | "signed_out" | "forbidden" | "error";
type LevelFilter = "all" | AthleteTrainingLevel;
type CompletionFilter = "all" | "complete" | "incomplete";
type TrainingFilter = "all" | TrainingStatus | "none";

type AthletesResponse = {
  coach: CoachProfile;
  athletes: CoachAthleteListItem[];
};

type AthleteDetailResponse = {
  detail: CoachAthleteDetail;
};

type AssignmentFormPayload = {
  profileId: string;
  assignedFor: string;
  title: string;
  description: string;
  focus: string;
  estimatedMinutes: number;
};

export function CoachDashboardClient() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [coach, setCoach] = useState<CoachProfile | null>(null);
  const [athletes, setAthletes] = useState<CoachAthleteListItem[]>([]);
  const [detail, setDetail] = useState<CoachAthleteDetail | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [status, setStatus] = useState<LoadState>("booting");
  const [message, setMessage] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>("all");
  const [trainingFilter, setTrainingFilter] = useState<TrainingFilter>("all");

  const loadAthleteDetail = useCallback(async (accessToken: string, profileId: string) => {
    setDetailLoading(true);
    setDetailError("");

    const response = await fetch(`/api/coach/athletes/${profileId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      cache: "no-store"
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setDetail(null);
      setDetailError(result?.error ?? "Could not load athlete detail.");
      setDetailLoading(false);
      return;
    }

    setDetail((result as AthleteDetailResponse).detail);
    setDetailLoading(false);
  }, []);

  const loadAthletes = useCallback(async (accessToken: string, preferredProfileId?: string, quiet = false) => {
    if (!quiet) {
      setStatus("loading");
    }

    setMessage("");
    setDetailError("");

    const response = await fetch("/api/coach/athletes", {
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
          : response.status === 403
            ? "forbidden"
            : "error"
      );
      setMessage(result?.error ?? "Could not load coach dashboard.");
      return;
    }

    const payload = result as AthletesResponse;
    const preferredAthlete =
      preferredProfileId
        ? payload.athletes.find((athlete) => athlete.profileId === preferredProfileId)
        : null;
    const firstAthleteId = preferredAthlete?.profileId ?? payload.athletes[0]?.profileId ?? null;

    setCoach(payload.coach);
    setAthletes(payload.athletes);
    setSelectedProfileId(firstAthleteId);
    setStatus("ready");

    if (firstAthleteId) {
      await loadAthleteDetail(accessToken, firstAthleteId);
    } else {
      setDetail(null);
    }
  }, [loadAthleteDetail]);

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

        await loadAthletes(data.session.access_token);
      } catch (error) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Coach dashboard failed to start.");
      }
    }

    void boot();

    return () => {
      active = false;
    };
  }, [loadAthletes]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setCoach(null);
        setAthletes([]);
        setDetail(null);
        setStatus("signed_out");
      }
    });

    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const filteredAthletes = useMemo(() => {
    const search = query.trim().toLowerCase();

    return athletes.filter((athlete) => {
      const searchable = [
        athlete.fullName,
        athlete.email,
        athlete.sport,
        athlete.primaryGoals,
        athlete.equipmentAccess
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchable.includes(search);
      const matchesLevel =
        levelFilter === "all" || athlete.trainingLevel === levelFilter;
      const matchesCompletion =
        completionFilter === "all" ||
        (completionFilter === "complete"
          ? athlete.onboardingCompleted
          : !athlete.onboardingCompleted);
      const matchesTraining =
        trainingFilter === "all" ||
        (trainingFilter === "none"
          ? !athlete.latestTrainingStatus
          : athlete.latestTrainingStatus === trainingFilter);

      return matchesSearch && matchesLevel && matchesCompletion && matchesTraining;
    });
  }, [athletes, completionFilter, levelFilter, query, trainingFilter]);

  async function refresh() {
    if (!session) {
      setStatus("signed_out");
      return;
    }

    await loadAthletes(session.access_token);
  }

  async function selectAthlete(profileId: string) {
    setSelectedProfileId(profileId);

    if (!session) {
      setStatus("signed_out");
      return;
    }

    await loadAthleteDetail(session.access_token, profileId);
  }

  async function assignTraining(payload: AssignmentFormPayload) {
    if (!session) {
      setStatus("signed_out");
      return;
    }

    const response = await fetch("/api/coach/assignments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error ?? "Could not save training assignment.");
    }

    await loadAthletes(session.access_token, payload.profileId, true);
  }

  if (status === "booting" || status === "loading") {
    return (
      <CoachShell coach={coach} userAction={session ? <SignOutButton /> : null}>
        <CenteredPanel icon={<Loader2 className="h-8 w-8 animate-spin text-accent/60" />}>
          <p className="text-sm font-black uppercase text-accent/45">Loading coach command</p>
        </CenteredPanel>
      </CoachShell>
    );
  }

  if (status === "signed_out") {
    return (
      <CoachShell coach={coach}>
        <StatePanel
          icon={<ShieldAlert className="h-7 w-7 text-accent/55" />}
          eyebrow="Sign in required"
          title="Open the coach dashboard."
          message={message || "Use a Supabase Auth account with a coach or admin role."}
          action={<ButtonLink href="/login">Sign In</ButtonLink>}
        />
      </CoachShell>
    );
  }

  if (status === "forbidden") {
    return (
      <CoachShell coach={coach} userAction={session ? <SignOutButton /> : null}>
        <StatePanel
          icon={<ShieldAlert className="h-7 w-7 text-red-300" />}
          eyebrow="Coach role required"
          title="This view is reserved for HTK operators."
          message={message || "Your account is signed in, but it is not marked as coach or admin."}
          action={<Button onClick={refresh}>Try Again</Button>}
        />
      </CoachShell>
    );
  }

  if (status === "error") {
    return (
      <CoachShell coach={coach} userAction={session ? <SignOutButton /> : null}>
        <StatePanel
          icon={<AlertTriangle className="h-7 w-7 text-red-300" />}
          eyebrow="Coach dashboard unavailable"
          title="Something needs attention."
          message={message || "Could not load the HTK coach dashboard."}
          action={<Button onClick={refresh}>Try Again</Button>}
        />
      </CoachShell>
    );
  }

  const selectedAthlete =
    detail?.athlete ??
    athletes.find((athlete) => athlete.profileId === selectedProfileId) ??
    null;
  const onboardedCount = athletes.filter((athlete) => athlete.onboardingCompleted).length;
  const completedTrainingCount = athletes.filter(
    (athlete) => athlete.latestTrainingStatus === "completed"
  ).length;

  return (
    <CoachShell coach={coach} userAction={<SignOutButton />}>
      <div className="grid gap-6 rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">HTK coach command</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
            Operator oversight without touching the athlete loop.
          </h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            Search athletes, inspect onboarding profiles, and review readiness and training completion signals.
          </p>
        </div>
        <div className="grid min-w-56 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <MetricTile label="Athletes" value={athletes.length.toString()} icon={Users} />
          <MetricTile label="Onboarded" value={onboardedCount.toString()} icon={UserCheck} />
          <MetricTile label="Training done" value={completedTrainingCount.toString()} icon={CheckCircle2} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[390px_1fr]">
        <section className="rounded-md border border-white/10 bg-primary p-5 shadow-premium">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase text-accent/40">Athlete roster</p>
              <h2 className="mt-2 text-2xl font-black">{filteredAthletes.length} visible</h2>
            </div>
            <Filter className="h-5 w-5 text-accent/45" />
          </div>

          <div className="mt-5 grid gap-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent/35" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, email, sport, goal"
                className="pl-10"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <SelectControl
                label="Level"
                value={levelFilter}
                onChange={(value) => setLevelFilter(value as LevelFilter)}
                options={[
                  ["all", "All levels"],
                  ["beginner", "Beginner"],
                  ["intermediate", "Intermediate"],
                  ["advanced", "Advanced"],
                  ["competitive", "Competitive"]
                ]}
              />
              <SelectControl
                label="Onboarding"
                value={completionFilter}
                onChange={(value) => setCompletionFilter(value as CompletionFilter)}
                options={[
                  ["all", "All"],
                  ["complete", "Complete"],
                  ["incomplete", "Incomplete"]
                ]}
              />
              <SelectControl
                label="Training"
                value={trainingFilter}
                onChange={(value) => setTrainingFilter(value as TrainingFilter)}
                options={[
                  ["all", "All status"],
                  ["assigned", "Assigned"],
                  ["completed", "Completed"],
                  ["skipped", "Skipped"],
                  ["none", "No assignment"]
                ]}
              />
            </div>
          </div>

          <div className="mt-5 grid max-h-[720px] gap-3 overflow-y-auto pr-1">
            {filteredAthletes.length ? (
              filteredAthletes.map((athlete) => (
                <AthleteRosterButton
                  key={athlete.profileId}
                  athlete={athlete}
                  active={athlete.profileId === selectedProfileId}
                  coachName={coach?.name ?? "HTK coaching team"}
                  onClick={() => void selectAthlete(athlete.profileId)}
                />
              ))
            ) : (
              <div className="rounded-md border border-white/10 bg-background p-4 text-sm text-accent/55">
                No athletes match these filters.
              </div>
            )}
          </div>
        </section>

        <AthleteDetailPanel
          athletes={athletes}
          athlete={selectedAthlete}
          detail={detail}
          detailLoading={detailLoading}
          detailError={detailError}
          selectedProfileId={selectedProfileId}
          onSelectAthlete={(profileId) => void selectAthlete(profileId)}
          onAssignTraining={assignTraining}
        />
      </div>
    </CoachShell>
  );
}

function CoachShell({
  children,
  coach,
  userAction
}: {
  children: ReactNode;
  coach: CoachProfile | null;
  userAction?: ReactNode;
}) {
  const identity = coach ? toIdentity(coach) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-primary">
        <div className="container-px mx-auto flex min-h-20 max-w-7xl flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <HtkWordmark href="/coach" label="Go to HTK coach dashboard" eyebrow="Coach dashboard" />
          <div className="flex flex-wrap items-center gap-3">
            {canManagePlatform(coach?.role) ? (
              <ButtonLink href="/admin" variant="outline" className="min-h-10 px-4 text-xs">
                Admin Panel
              </ButtonLink>
            ) : null}
            <ButtonLink href="/dashboard" variant="outline" className="min-h-10 px-4 text-xs">
              Athlete View
            </ButtonLink>
            {userAction}
            {identity ? <ViewStatusBadge view="coach" /> : null}
            {identity ? <UserIdentityBadge user={identity} /> : null}
          </div>
        </div>
      </header>
      <main className="container-px mx-auto max-w-7xl py-8 md:py-12">{children}</main>
    </div>
  );
}

function CenteredPanel({
  icon,
  children
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-[50vh] place-items-center rounded-md border border-white/10 bg-primary p-8 text-center">
      <div>
        <div className="grid place-items-center">{icon}</div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function StatePanel({
  icon,
  eyebrow,
  title,
  message,
  action
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  message: string;
  action: ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/10 bg-primary p-8 shadow-premium">
      {icon}
      <p className="mt-5 text-sm font-black uppercase text-accent/45">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-black">{title}</h1>
      <p className="mt-4 max-w-2xl text-accent/60">{message}</p>
      <div className="mt-6">{action}</div>
    </section>
  );
}

function MetricTile({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-background p-4">
      <Icon className="h-5 w-5 text-accent/45" />
      <p className="mt-4 text-xs font-black uppercase text-accent/40">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function SelectControl({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black uppercase text-accent/40">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-background px-3 text-sm font-bold text-accent outline-none transition focus:border-accent/70"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function AthleteRosterButton({
  athlete,
  active,
  coachName,
  onClick
}: {
  athlete: CoachAthleteListItem;
  active: boolean;
  coachName: string;
  onClick: () => void;
}) {
  const trainingStatus = athlete.latestTrainingStatus ? formatStatus(athlete.latestTrainingStatus) : "No assignment yet";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={`Open profile panel for ${athlete.fullName}`}
      className={cn(
        "rounded-md border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
        active
          ? "border-htk-red/70 bg-htk-red/[0.09]"
          : "border-white/10 bg-background hover:border-htk-red/35 hover:bg-white/[0.04]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-htk-red/25 bg-htk-red/[0.08] text-htk-red">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-black">{athlete.fullName}</p>
            <p className="mt-1 text-xs text-accent/45">{athlete.email || "No email saved"}</p>
            <p className="mt-2 text-[10px] font-black uppercase text-htk-red">Open profile panel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {athlete.onboardingCompleted ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-accent/65" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-red-300/80" />
          )}
          <ChevronRight className={cn("h-4 w-4 text-htk-red transition", active && "rotate-90")} />
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-xs text-accent/60">
        <RosterLine label="Sport" value={formatOptionalText(athlete.sport, "General performance")} />
        <RosterLine label="Goal" value={formatOptionalText(athlete.primaryGoals, "No goal listed yet")} />
        <RosterLine label="Status" value={`${athlete.trainingLevel ? formatTrainingLevel(athlete.trainingLevel) : "No level listed"} / ${trainingStatus}`} />
        <RosterLine label="Assigned coach" value={coachName} />
        <RosterLine
          label="Readiness"
          value={athlete.latestReadinessScore === null ? "No check-in yet" : `${athlete.latestReadinessScore}%`}
        />
      </div>
    </button>
  );
}

function RosterLine({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="font-black uppercase text-accent/40">{label}: </span>
      <span className="font-bold text-accent/75">{value}</span>
    </p>
  );
}

function AthleteDetailPanel({
  athletes,
  athlete,
  detail,
  detailLoading,
  detailError,
  selectedProfileId,
  onSelectAthlete,
  onAssignTraining
}: {
  athletes: CoachAthleteListItem[];
  athlete: CoachAthleteListItem | null;
  detail: CoachAthleteDetail | null;
  detailLoading: boolean;
  detailError: string;
  selectedProfileId: string | null;
  onSelectAthlete: (profileId: string) => void;
  onAssignTraining: (payload: AssignmentFormPayload) => Promise<void>;
}) {
  if (!athlete) {
    return (
      <section className="rounded-md border border-white/10 bg-primary p-8 shadow-premium">
        <Users className="h-7 w-7 text-accent/45" />
        <p className="mt-5 text-sm font-black uppercase text-accent/45">No athletes yet</p>
        <h2 className="mt-3 text-3xl font-black">Athletes will appear here after signup.</h2>
        <p className="mt-4 max-w-2xl text-accent/60">
          The coach view reads saved profiles, onboarding records, daily check-ins, and training assignments.
        </p>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-accent/45">Selected athlete</p>
            <h2 className="mt-3 text-4xl font-black">{athlete.fullName}</h2>
            <p className="mt-2 text-sm text-accent/50">{athlete.email || "No email saved"}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <MiniSignal
              icon={Activity}
              label="Readiness"
              value={athlete.latestReadinessScore === null ? "No data" : `${athlete.latestReadinessScore}%`}
            />
            <MiniSignal
              icon={ClipboardList}
              label="Check-ins"
              value={(detail?.checkIns.length ?? 0).toString()}
            />
            <MiniSignal
              icon={Dumbbell}
              label="Training"
              value={athlete.latestTrainingStatus ? formatStatus(athlete.latestTrainingStatus) : "No assignment"}
            />
          </div>
        </div>
        {athlete.latestPainFlag ? (
          <div className="mt-5 rounded-md border border-red-300/20 bg-red-950/20 p-4 text-sm font-bold text-red-200">
            Latest check-in includes a pain or injury flag.
          </div>
        ) : null}
      </section>

      {detailLoading ? (
        <CenteredPanel icon={<Loader2 className="h-7 w-7 animate-spin text-accent/60" />}>
          <p className="text-sm font-black uppercase text-accent/45">Loading athlete record</p>
        </CenteredPanel>
      ) : null}

      {detailError ? (
        <section className="rounded-md border border-red-300/20 bg-primary p-5 text-sm text-red-200">
          {detailError}
        </section>
      ) : null}

      {!detailLoading && !detailError ? (
        <>
          <AssignmentForm
            athletes={athletes}
            selectedProfileId={selectedProfileId}
            onSelectAthlete={onSelectAthlete}
            onSubmit={onAssignTraining}
          />
          <OnboardingPanel onboarding={detail?.onboarding ?? null} athlete={athlete} />
          <div className="grid gap-6 lg:grid-cols-2">
            <ReadinessHistory checkIns={detail?.checkIns ?? []} />
            <TrainingHistory training={detail?.training ?? []} />
          </div>
        </>
      ) : null}
    </div>
  );
}

function MiniSignal({
  icon: Icon,
  label,
  value
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-32 rounded-md border border-white/10 bg-background p-4">
      <Icon className="h-4 w-4 text-accent/45" />
      <p className="mt-3 text-xs font-black uppercase text-accent/40">{label}</p>
      <p className="mt-2 text-sm font-black">{value}</p>
    </div>
  );
}

function AssignmentForm({
  athletes,
  selectedProfileId,
  onSelectAthlete,
  onSubmit
}: {
  athletes: CoachAthleteListItem[];
  selectedProfileId: string | null;
  onSelectAthlete: (profileId: string) => void;
  onSubmit: (payload: AssignmentFormPayload) => Promise<void>;
}) {
  const [profileId, setProfileId] = useState(selectedProfileId ?? athletes[0]?.profileId ?? "");
  const [assignedFor, setAssignedFor] = useState(() => getDateInputValue(new Date()));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [focus, setFocus] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("45");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (selectedProfileId) {
      setProfileId(selectedProfileId);
    }
  }, [selectedProfileId]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await onSubmit({
        profileId,
        assignedFor,
        title,
        description,
        focus,
        estimatedMinutes: Number(estimatedMinutes)
      });

      setTitle("");
      setDescription("");
      setFocus("");
      setEstimatedMinutes("45");
      setSuccess(`Training assigned for ${formatDate(assignedFor)}.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save training assignment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Assign training</p>
          <h3 className="mt-3 text-3xl font-black">Create a dated session.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-accent/60">
            This saves directly to the athlete&apos;s assignment calendar. If the date is today, their dashboard will show it immediately.
          </p>
        </div>
        <CalendarPlus className="h-7 w-7 shrink-0 text-accent/45" />
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-[1fr_180px_150px]">
          <SelectControl
            label="Athlete"
            value={profileId}
            onChange={(value) => {
              setProfileId(value);
              onSelectAthlete(value);
            }}
            options={athletes.map((athlete) => [
              athlete.profileId,
              `${athlete.fullName}${athlete.email ? ` · ${athlete.email}` : ""}`
            ])}
          />
          <label>
            <span className="mb-2 block text-xs font-black uppercase text-accent/40">Assigned date</span>
            <Input
              type="date"
              value={assignedFor}
              onChange={(event) => setAssignedFor(event.target.value)}
              required
            />
          </label>
          <label>
            <span className="mb-2 block text-xs font-black uppercase text-accent/40">Minutes</span>
            <Input
              type="number"
              min={1}
              max={240}
              value={estimatedMinutes}
              onChange={(event) => setEstimatedMinutes(event.target.value)}
              required
            />
          </label>
        </div>

        <label>
          <span className="mb-2 block text-xs font-black uppercase text-accent/40">Title</span>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Lower-body strength and engine"
            maxLength={160}
            required
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-black uppercase text-accent/40">Description</span>
          <Textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write the session instructions, constraints, and intent."
            maxLength={2000}
            required
          />
        </label>

        <label>
          <span className="mb-2 block text-xs font-black uppercase text-accent/40">Focus</span>
          <Input
            value={focus}
            onChange={(event) => setFocus(event.target.value)}
            placeholder="Strength, conditioning, movement quality"
            maxLength={500}
            required
          />
        </label>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        {success ? <p className="text-sm font-bold text-accent/70">{success}</p> : null}

        <Button type="submit" disabled={saving || !profileId}>
          {saving ? "Saving" : "Assign Training"}
        </Button>
      </form>
    </section>
  );
}

function OnboardingPanel({
  onboarding,
  athlete
}: {
  onboarding: CoachAthleteOnboardingProfile | null;
  athlete: CoachAthleteListItem;
}) {
  if (!onboarding) {
    return (
      <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
        <p className="text-sm font-black uppercase text-accent/45">Onboarding profile</p>
        <h3 className="mt-3 text-3xl font-black">Not completed yet.</h3>
        <p className="mt-4 text-sm leading-6 text-accent/60">
          This athlete has a profile, but no saved questionnaire record.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Onboarding profile</p>
          <h3 className="mt-3 text-3xl font-black">
            {formatTrainingLevel(onboarding.trainingLevel)} · {formatOptionalText(onboarding.sport, "General performance")}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-accent/60">
            {formatOptionalText(onboarding.primaryGoals, "No goal listed yet")}
          </p>
        </div>
        <div className="grid size-16 place-items-center rounded-md border border-white/10 bg-background">
          <Target className="h-7 w-7 text-accent/55" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DetailItem label="Age" value={onboarding.age.toString()} />
        <DetailItem label="BMI" value={onboarding.bmi.toFixed(2)} />
        <DetailItem label="Height" value={formatHeight(onboarding)} />
        <DetailItem label="Weight" value={formatWeight(onboarding)} />
        <DetailItem label="Weekly availability" value={`${onboarding.weeklyAvailability} sessions`} />
        <DetailItem label="Session duration" value={`${onboarding.sessionDuration} min`} />
        <DetailItem label="Cleared for exercise" value={onboarding.clearedForExercise ? "Yes" : "No"} />
        <DetailItem label="Onboarding completed" value={formatDateTime(athlete.onboardingCompletedAt)} />
        <DetailItem label="Equipment access" value={onboarding.equipmentAccess} wide />
        <DetailItem
          label="Injuries/current pain"
          value={formatOptionalText(onboarding.injuriesCurrentPain, "None reported")}
          wide
        />
      </div>
    </section>
  );
}

function DetailItem({
  label,
  value,
  wide = false
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("rounded-md border border-white/10 bg-background p-4", wide && "sm:col-span-2")}>
      <p className="text-xs font-black uppercase text-accent/40">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-accent/75">{value}</p>
    </div>
  );
}

function ReadinessHistory({ checkIns }: { checkIns: CoachCheckInHistoryItem[] }) {
  return (
    <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Readiness history</p>
          <h3 className="mt-3 text-2xl font-black">Daily check-ins</h3>
        </div>
        <Activity className="h-6 w-6 text-accent/45" />
      </div>

      <div className="mt-5 grid gap-3">
        {checkIns.length ? (
          checkIns.map((checkIn) => (
            <div key={checkIn.id} className="rounded-md border border-white/10 bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{formatDate(checkIn.checkInDate)}</p>
                  <p className="mt-1 text-xs text-accent/45">
                    Sleep {checkIn.sleepQuality} · Energy {checkIn.energy} · Soreness {checkIn.soreness} · Stress{" "}
                    {checkIn.stress}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black">{checkIn.readinessScore}%</p>
                  <p className="text-xs uppercase text-accent/40">ready</p>
                </div>
              </div>
              {checkIn.painFlag ? (
                <p className="mt-3 rounded-md border border-red-300/20 bg-red-950/20 px-3 py-2 text-xs font-bold text-red-200">
                  Pain flag reported
                </p>
              ) : null}
              {checkIn.bodyNotes ? (
                <p className="mt-3 text-sm leading-6 text-accent/60">{checkIn.bodyNotes}</p>
              ) : null}
            </div>
          ))
        ) : (
          <p className="rounded-md border border-white/10 bg-background p-4 text-sm text-accent/55">
            No check-ins saved yet.
          </p>
        )}
      </div>
    </section>
  );
}

function TrainingHistory({ training }: { training: CoachTrainingHistoryItem[] }) {
  return (
    <section className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Training completion</p>
          <h3 className="mt-3 text-2xl font-black">Assignments</h3>
        </div>
        <Dumbbell className="h-6 w-6 text-accent/45" />
      </div>

      <div className="mt-5 grid gap-3">
        {training.length ? (
          training.map((assignment) => (
            <div key={assignment.id} className="rounded-md border border-white/10 bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black">{assignment.title}</p>
                  <p className="mt-1 text-xs text-accent/45">
                    {formatDate(assignment.assignedFor)} · {assignment.estimatedMinutes} min
                  </p>
                </div>
                <StatusPill status={assignment.status} />
              </div>
              <p className="mt-3 text-sm leading-6 text-accent/60">{assignment.description}</p>
              <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase text-accent/40">Focus</p>
                  <p className="mt-2 font-bold text-accent/75">{assignment.focus}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-accent/40">Completed</p>
                  <p className="mt-2 font-bold text-accent/75">{formatDateTime(assignment.completedAt)}</p>
                </div>
              </div>
              {assignment.clientNotes ? (
                <p className="mt-3 rounded-md border border-white/10 bg-primary p-3 text-sm leading-6 text-accent/60">
                  {assignment.clientNotes}
                </p>
              ) : null}
            </div>
          ))
        ) : (
          <p className="rounded-md border border-white/10 bg-background p-4 text-sm text-accent/55">
            No training assignments saved yet.
          </p>
        )}
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: TrainingStatus }) {
  const complete = status === "completed";
  const skipped = status === "skipped";

  return (
    <span
      className={cn(
        "shrink-0 rounded-md border px-3 py-1 text-xs font-black uppercase",
        complete && "border-accent/30 bg-accent/10 text-accent",
        skipped && "border-red-300/20 bg-red-950/20 text-red-200",
        !complete && !skipped && "border-white/10 bg-primary text-accent/55"
      )}
    >
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status: TrainingStatus) {
  return status[0].toUpperCase() + status.slice(1);
}

function formatTrainingLevel(level: AthleteTrainingLevel) {
  return level[0].toUpperCase() + level.slice(1);
}

function formatOptionalText(value: string | null | undefined, fallback: string) {
  const cleaned = value?.replace(/[·•]/g, " ").replace(/\s+/g, " ").trim() ?? "";
  const withoutPunctuation = cleaned.replace(/[^a-z0-9]/gi, "");
  const repeatedSingleCharacter =
    withoutPunctuation.length >= 4 && new Set(withoutPunctuation.toLowerCase()).size === 1;

  if (!cleaned || repeatedSingleCharacter) {
    return fallback;
  }

  return cleaned;
}

function toIdentity(profile: CoachProfile) {
  return {
    name: profile.name,
    initials: initialsFor(profile.name, profile.email),
    email: profile.email,
    role: profile.role
  };
}

function initialsFor(name: string, email: string) {
  const source = name.trim() || email.trim();
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase() || "HT";
}

function getDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "No date";
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not saved";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatHeight(onboarding: CoachAthleteOnboardingProfile) {
  if (onboarding.unitSystem === "lbs" && onboarding.heightInches !== null) {
    return `${onboarding.heightInches} in`;
  }

  if (onboarding.heightCm !== null) {
    return `${onboarding.heightCm} cm`;
  }

  return "Not saved";
}

function formatWeight(onboarding: CoachAthleteOnboardingProfile) {
  if (onboarding.unitSystem === "lbs" && onboarding.currentWeightLbs !== null) {
    return `${onboarding.currentWeightLbs} lbs`;
  }

  if (onboarding.currentWeightKg !== null) {
    return `${onboarding.currentWeightKg} kg`;
  }

  return "Not saved";
}
