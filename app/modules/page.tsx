import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { modules } from "@/lib/content";
import { getAccessState } from "@/lib/access";

export default async function ModulesPage() {
  const { hasAccess, completedLessons } = await getAccessState();

  return (
    <DashboardShell>
      <div className="rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8">
        <p className="text-sm font-black uppercase text-accent/45">Playbook modules</p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">Training library</h1>
        <p className="mt-4 max-w-2xl text-accent/60">
          Move in sequence: command center, content engine, monetization blueprint, then execution protocol.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
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
