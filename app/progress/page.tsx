import { CheckCircle2, Circle } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { modules } from "@/lib/content";
import { getAccessState } from "@/lib/access";

export default async function ProgressPage() {
  const { completedLessons } = await getAccessState();

  const percent = Math.round((completedLessons.length / modules.length) * 100);

  return (
    <DashboardShell>
      <div className="grid gap-6 rounded-md border border-white/10 bg-primary p-6 shadow-premium md:p-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Progress</p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">Execution scorecard</h1>
          <p className="mt-4 max-w-2xl text-accent/60">
            Completion is tracked per module. Keep the dashboard honest.
          </p>
        </div>
        <ProgressRing percent={percent} />
      </div>
      <div className="mt-8 grid gap-3">
        {modules.map((module) => {
          const done = completedLessons.includes(module.id);
          return (
            <div key={module.id} className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-primary p-5 transition hover:border-white/20">
              <div>
                <h2 className="font-black">{module.title}</h2>
                <p className="mt-1 text-sm text-accent/50">{module.duration}</p>
              </div>
              {done ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6 text-accent/35" />}
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
