import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { Dumbbell, ListChecks, SlidersHorizontal } from "lucide-react";
import { modules } from "@/lib/content";
import { getAccessState } from "@/lib/access";

export default async function ModulesPage() {
  const { user, hasAccess, completedLessons } = await getAccessState();

  return (
    <DashboardShell user={user}>
      <div className="htk-panel overflow-hidden p-6 md:p-8">
        <div className="htk-red-rule" />
        <p className="htk-kicker mt-5">HTK training modules</p>
        <h1 className="mt-3 max-w-4xl text-5xl font-black leading-none text-accent sm:text-7xl">
          Build a Body That Is Hard to Kill.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-htk-muted">
          Explosive, mobile, enduring, resilient, and efficient. Open a module to train for real-world performance
          through preset sessions, exercise libraries, and custom workout builds.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <PathCard
            icon={<Dumbbell className="h-5 w-5" />}
            title="Browse Exercises"
            href="#module-library"
            copy="Review cues, mistakes, modifications, safety notes, and video placeholders."
          />
          <PathCard
            icon={<ListChecks className="h-5 w-5" />}
            title="Preset Workouts"
            href="#module-library"
            copy="Use ready-built HTK sessions for focused, disciplined execution."
          />
          <PathCard
            icon={<SlidersHorizontal className="h-5 w-5" />}
            title="Build Custom Workout"
            href="#module-library"
            copy="Filter by goal, body area, equipment, difficulty, duration, and pattern."
          />
        </div>
      </div>

      <section
        id="module-library"
        tabIndex={-1}
        className="mt-10 scroll-mt-24 focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="htk-kicker">Module library</p>
            <h2 className="htk-section-title mt-2">Select a training focus</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-htk-muted">
            Move well. Hit hard. Last longer. Recover smarter. Each module stays focused on the work that belongs there.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              unlocked={hasAccess}
              completed={completedLessons.includes(module.id)}
            />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

function PathCard({ icon, title, href, copy }: { icon: ReactNode; title: string; href: string; copy: string }) {
  return (
    <a
      href={href}
      className="htk-path-card block focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background"
      aria-label={`${title}: choose a training module first`}
    >
      <div className="text-htk-red">{icon}</div>
      <p className="mt-3 text-sm font-black uppercase text-accent">{title}</p>
      <p className="mt-2 text-sm leading-6 text-htk-muted">{copy}</p>
      <p className="mt-4 text-xs font-black uppercase text-htk-red">Choose a module first</p>
    </a>
  );
}
