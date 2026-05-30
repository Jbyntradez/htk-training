"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Users
} from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button, ButtonLink } from "@/components/ui/button";
import type { AdminOverview, AdminProfile } from "@/lib/admin-platform-types";
import { canAccessCoachTools, canManagePlatform } from "@/lib/role-permissions";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

type LoadState = "booting" | "loading" | "ready" | "signed_out" | "forbidden" | "error";

type AdminOverviewResponse = {
  admin: AdminProfile;
  overview: AdminOverview;
};

export function AdminDashboardClient() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [status, setStatus] = useState<LoadState>("booting");
  const [message, setMessage] = useState("");

  const loadOverview = useCallback(async (accessToken: string) => {
    setStatus("loading");
    setMessage("");

    const response = await fetch("/api/admin/overview", {
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
      setMessage(result?.error ?? "Could not load admin panel.");
      return;
    }

    const payload = result as AdminOverviewResponse;
    setAdmin(payload.admin);
    setOverview(payload.overview);
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

        await loadOverview(data.session.access_token);
      } catch (error) {
        if (!active) {
          return;
        }

        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Admin panel failed to start.");
      }
    }

    void boot();

    return () => {
      active = false;
    };
  }, [loadOverview]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) {
        setAdmin(null);
        setOverview(null);
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

    await loadOverview(session.access_token);
  }

  if (status === "booting" || status === "loading") {
    return (
      <AdminShell admin={admin} userAction={session ? <SignOutButton /> : null}>
        <CenteredPanel icon={<Loader2 className="h-8 w-8 animate-spin text-accent/60" />}>
          <p className="text-sm font-black uppercase text-accent/45">Loading admin panel</p>
        </CenteredPanel>
      </AdminShell>
    );
  }

  if (status === "signed_out") {
    return (
      <AdminShell admin={admin}>
        <StatePanel
          icon={<ShieldAlert className="h-7 w-7 text-accent/55" />}
          eyebrow="Sign in required"
          title="Open the admin panel."
          message={message || "Use a Supabase Auth account with the admin role."}
          action={<ButtonLink href="/login">Sign In</ButtonLink>}
        />
      </AdminShell>
    );
  }

  if (status === "forbidden") {
    return (
      <AdminShell admin={admin} userAction={session ? <SignOutButton /> : null}>
        <StatePanel
          icon={<ShieldAlert className="h-7 w-7 text-red-300" />}
          eyebrow="Admin role required"
          title="This panel is reserved for HTK admins."
          message={message || "Your account is signed in, but it is not marked as admin."}
          action={<Button onClick={refresh}>Try Again</Button>}
        />
      </AdminShell>
    );
  }

  if (status === "error" || !overview) {
    return (
      <AdminShell admin={admin} userAction={session ? <SignOutButton /> : null}>
        <StatePanel
          icon={<AlertTriangle className="h-7 w-7 text-red-300" />}
          eyebrow="Admin panel unavailable"
          title="Something needs attention."
          message={message || "Could not load the HTK admin panel."}
          action={<Button onClick={refresh}>Try Again</Button>}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell admin={admin} userAction={<SignOutButton />}>
      <section className="grid gap-6 rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">HTK admin panel</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">Platform control.</h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            Role access, athlete volume, training assignments, and platform activity.
          </p>
        </div>
        <div className="grid min-w-56 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <ButtonLink href="/coach" variant="outline" className="min-h-11 px-4 text-xs">
            Coach Tools
          </ButtonLink>
          <Button onClick={refresh} variant="outline" className="min-h-11 px-4 text-xs">
            Refresh
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={Users} label="Athletes" value={overview.roleCounts.athlete.toString()} />
        <MetricTile icon={ShieldCheck} label="Coaches" value={overview.roleCounts.coach.toString()} />
        <MetricTile icon={ShieldAlert} label="Admins" value={overview.roleCounts.admin.toString()} />
        <MetricTile icon={Activity} label="Check-ins" value={overview.totalCheckIns.toString()} />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-accent/45">Assignments</p>
              <h2 className="mt-3 text-3xl font-black">{overview.assignmentStatusCounts.total}</h2>
            </div>
            <Dumbbell className="h-6 w-6 text-accent/45" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <SmallStat label="Assigned" value={overview.assignmentStatusCounts.assigned} />
            <SmallStat label="Completed" value={overview.assignmentStatusCounts.completed} />
            <SmallStat label="Skipped" value={overview.assignmentStatusCounts.skipped} />
          </div>
          <div className="mt-6 rounded-md border border-white/10 bg-background p-4">
            <p className="text-xs font-black uppercase text-accent/40">Onboarding completed</p>
            <p className="mt-2 text-2xl font-black">
              {overview.onboardingCompleted} / {overview.roleCounts.total}
            </p>
          </div>
        </div>

        <div className="rounded-md border border-white/10 bg-primary p-6 shadow-premium">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-accent/45">Recent profiles</p>
              <h2 className="mt-3 text-3xl font-black">Role map</h2>
            </div>
            <ClipboardList className="h-6 w-6 text-accent/45" />
          </div>
          <div className="mt-5 grid gap-3">
            {overview.recentProfiles.length ? (
              overview.recentProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex flex-col gap-3 rounded-md border border-white/10 bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-black">{profile.fullName}</p>
                    <p className="mt-1 text-xs text-accent/45">{profile.email || "No email saved"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RolePill role={profile.role} />
                    {profile.onboardingCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-accent/60" />
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-md border border-white/10 bg-background p-4 text-sm text-accent/55">
                No profiles saved yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}

function AdminShell({
  children,
  admin,
  userAction
}: {
  children: ReactNode;
  admin: AdminProfile | null;
  userAction?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10 bg-primary">
        <div className="container-px mx-auto flex min-h-20 max-w-7xl flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase">HTK Operator</p>
            <p className="mt-1 text-xs font-bold uppercase text-accent/40">Admin panel</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink href="/coach" variant="outline" className="min-h-10 px-4 text-xs">
              Coach Tools
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="outline" className="min-h-10 px-4 text-xs">
              Athlete View
            </ButtonLink>
            {userAction}
            {admin ? (
              <div className="rounded-md border border-white/10 bg-background px-3 py-2 text-right">
                <p className="text-sm font-black">{admin.name}</p>
                <p className="text-xs uppercase text-accent/45">{admin.role}</p>
              </div>
            ) : null}
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
  icon: Icon,
  label,
  value
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-primary p-5 shadow-premium">
      <Icon className="h-5 w-5 text-accent/45" />
      <p className="mt-4 text-xs font-black uppercase text-accent/40">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/10 bg-background p-4">
      <p className="text-xs font-black uppercase text-accent/40">{label}</p>
      <p className="mt-2 text-xl font-black">{value}</p>
    </div>
  );
}

function RolePill({ role }: { role: AdminOverview["recentProfiles"][number]["role"] }) {
  return (
    <span
      className={cn(
        "rounded-md border px-3 py-1 text-xs font-black uppercase",
        canManagePlatform(role) && "border-red-300/20 bg-red-950/20 text-red-200",
        canAccessCoachTools(role) &&
          !canManagePlatform(role) &&
          "border-accent/30 bg-accent/10 text-accent",
        !canAccessCoachTools(role) && "border-white/10 bg-primary text-accent/55"
      )}
    >
      {role}
    </span>
  );
}
