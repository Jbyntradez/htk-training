import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Dumbbell, Gauge, Target } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CompleteButton } from "@/components/dashboard/CompleteButton";
import { ModuleTrainingBuilder } from "@/components/training-builder/ModuleTrainingBuilder";
import { Badge } from "@/components/ui/badge";
import { getAccessState } from "@/lib/access";
import { getModuleById, modules } from "@/lib/content";
import { getModuleWorkoutBuilder } from "@/lib/training-builder-data";

export function generateStaticParams() {
  return modules.map((module) => ({ id: module.id }));
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trainingModule = getModuleById(id);
  const moduleBuilder = getModuleWorkoutBuilder(id);

  if (!trainingModule || !moduleBuilder) {
    notFound();
  }

  const { user, completedLessons } = await getAccessState();

  return (
    <DashboardShell user={user}>
      <article>
        <Link
          href="/modules"
          className="mb-5 inline-flex items-center gap-2 rounded-md border border-htk-red/35 bg-black/30 px-3 py-2 text-xs font-black uppercase text-accent/75 transition hover:border-htk-red hover:bg-htk-red/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Modules
        </Link>

        <div className="htk-panel overflow-hidden p-6 md:p-8">
          <div className="htk-red-rule" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="htk-kicker mt-5">Training module</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-black leading-none text-accent sm:text-7xl">
                {trainingModule.title}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-htk-muted">{trainingModule.shortDescription}</p>
              <p className="mt-4 max-w-3xl text-sm font-bold uppercase leading-6 text-accent/80">
                Performance coaching, not generic fitness. Built for real-world performance.
              </p>
            </div>
            <CompleteButton moduleId={trainingModule.id} completed={completedLessons.includes(trainingModule.id)} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="htk-subcard p-4">
              <Target className="h-5 w-5 text-htk-red" />
              <p className="mt-3 text-xs font-black uppercase text-htk-red">Training goal</p>
              <p className="mt-2 text-sm leading-6 text-accent/80">{trainingModule.trainingGoal}</p>
            </div>
            <div className="htk-subcard p-4">
              <Gauge className="h-5 w-5 text-htk-red" />
              <p className="mt-3 text-xs font-black uppercase text-htk-red">Difficulty</p>
              <p className="mt-2 text-sm font-black text-accent">{trainingModule.difficultyLevel}</p>
            </div>
            <div className="htk-subcard p-4">
              <Dumbbell className="h-5 w-5 text-htk-red" />
              <p className="mt-3 text-xs font-black uppercase text-htk-red">Equipment</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {trainingModule.equipmentNeeded.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="htk-danger-note mt-6 p-4">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-htk-red" />
              <p className="text-sm leading-6 text-accent/75">
                This module is performance coaching content. It is not medical advice, injury diagnosis, or rehab.
                Stop or modify work if concerning pain, symptoms, or unsafe movement appears, and escalate medical
                questions to a qualified professional.
              </p>
            </div>
          </div>
        </div>

        <ModuleTrainingBuilder trainingModule={trainingModule} builder={moduleBuilder} />
      </article>
    </DashboardShell>
  );
}
