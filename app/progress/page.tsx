import Link from "next/link";
import { CheckCircle2, Circle, Dumbbell } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { modules } from "@/lib/content";
import { getAccessState } from "@/lib/access";

export default async function ProgressPage() {
  const { user, completedLessons } = await getAccessState();

  const completedModuleIds = completedLessons.filter((moduleId) =>
    modules.some((module) => module.id === moduleId)
  );
  const percent = Math.round((completedModuleIds.length / modules.length) * 100);

  return (
    <DashboardShell user={user}>
      <div className="grid gap-6 rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Progress</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">Execution scorecard</h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            Completion is tracked per module. Keep the dashboard honest.
          </p>
        </div>
        <ProgressRing percent={percent} label="Complete" />
      </div>
      <div className="mt-8 grid gap-3">
        {modules.map((module) => {
          const done = completedLessons.includes(module.id);
          const modulePercent = done ? 100 : 0;

          return (
            <Link
              key={module.id}
              href={`/module/${module.id}`}
              className="grid gap-4 rounded-md border border-white/10 bg-primary p-5 transition hover:border-htk-red/40 hover:bg-htk-red/[0.05] focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-4 w-4 text-htk-red" />
                  <h2 className="font-black">{module.title}</h2>
                </div>
                <p className="mt-2 text-sm text-accent/50">
                  {module.difficultyLevel} | {module.exercises.length} core exercises
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <div className="h-full rounded-full bg-htk-red" style={{ width: `${modulePercent}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm font-black uppercase text-accent/60">
                {done ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-accent" />
                    Complete
                  </>
                ) : (
                  <>
                    <Circle className="h-6 w-6 text-accent/35" />
                    Not complete
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardShell>
  );
}
