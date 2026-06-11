import { Activity, ShieldCheck, UserCheck } from "lucide-react";
import { Microcopy } from "@/components/ui/microcopy";

type UserIdentity = {
  name: string;
  initials: string;
  email?: string;
  role?: string;
};

export function UserIdentityBadge({ user }: { user: UserIdentity }) {
  return (
    <div
      className="flex items-center gap-3 rounded-md border border-white/10 bg-black/35 px-3 py-2"
      aria-label={`Signed in as ${user.name}`}
    >
      <div className="grid h-8 w-8 place-items-center rounded-md bg-htk-red text-xs font-black text-white">
        {user.initials}
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-black">{user.name}</p>
        <p className="text-xs text-htk-muted">{user.role ?? user.email ?? "HTK operator"}</p>
      </div>
    </div>
  );
}

const viewStatus = {
  athlete: {
    label: "Athlete view",
    description: "You are viewing the athlete-facing training dashboard, modules, and progress screens.",
    icon: Activity
  },
  coach: {
    label: "Coach",
    description: "You are viewing coach tools for athlete oversight, assignments, and readiness signals.",
    icon: UserCheck
  },
  admin: {
    label: "Admin",
    description: "You are viewing platform-level controls for roles, profiles, and system activity.",
    icon: ShieldCheck
  }
} as const;

export type ViewStatus = keyof typeof viewStatus;

export function ViewStatusBadge({ view }: { view: ViewStatus }) {
  const status = viewStatus[view];
  const Icon = status.icon;

  return (
    <Microcopy
      label={status.label}
      description={status.description}
      icon={<Icon className="h-3.5 w-3.5" />}
      align="right"
      summaryClassName="min-h-10 border-htk-red/30 bg-htk-red/[0.08] text-accent"
    />
  );
}
