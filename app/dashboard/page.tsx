import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { modules } from "@/lib/content";
import { getAccessState } from "@/lib/access";
import { ArrowRight, CheckCircle2, Target, Timer } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default async function DashboardPage() {
  const { user, hasAccess, completedLessons } = await getAccessState();

  const percent = Math.round((completedLessons.length / modules.length) * 100);

  return (
    <DashboardShell>
      <div className="grid gap-6 rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Operator dashboard</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">
            Build the asset, {user.firstName}.
          </h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            Today is simple: finish the current module, publish one faceless asset, and move one buyer closer to checkout.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/modules" className="w-full sm:w-auto">Continue Training</ButtonLink>
            <ButtonLink href="/progress" variant="outline" className="w-full sm:w-auto">View Scorecard</ButtonLink>
          </div>
        </div>
        <ProgressRing percent={percent} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { label: "Current focus", value: "Offer engine", icon: Target },
          { label: "Sprint pace", value: "Day 7 of 30", icon: Timer },
          { label: "Unlocked", value: "Core access", icon: CheckCircle2 }
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-white/10 bg-primary p-5">
            <item.icon className="h-5 w-5 text-accent/45" />
            <p className="mt-4 text-xs font-black uppercase text-accent/40">{item.label}</p>
            <p className="mt-2 text-xl font-black">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Next actions</p>
          <h2 className="mt-2 text-3xl font-black">Continue the build</h2>
        </div>
        <ButtonLink href="/modules" variant="ghost" className="hidden sm:inline-flex">
          All Modules <ArrowRight className="ml-2 h-4 w-4" />
        </ButtonLink>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {modules.slice(0, 2).map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            unlocked={hasAccess}
            completed={completedLessons.includes(module.id)}
          />
        ))}
      </div>
    </DashboardShell>
  );
}
