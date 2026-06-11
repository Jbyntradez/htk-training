import { CheckCircle2, Dumbbell, Lock, PlayCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { Module } from "@/lib/content";
import { getHTKTrainingModule } from "@/lib/htk-training-library";

export function ModuleCard({
  module,
  unlocked,
  completed
}: {
  module: Module;
  unlocked: boolean;
  completed: boolean;
}) {
  const libraryModule = getHTKTrainingModule(module.id);
  const exerciseCount = libraryModule?.exercises.length ?? module.exercises.length;
  const presetCount = libraryModule?.presetWorkouts.length ?? 0;
  const equipmentPreview = libraryModule?.equipmentOptions.slice(0, 2) ?? module.equipmentNeeded.slice(0, 2);

  return (
    <article className="htk-card h-full p-5 htk-card-hover md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="htk-kicker">{module.difficultyLevel}</p>
          <h3 className="mt-3 text-2xl font-black leading-tight text-accent">{module.title}</h3>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-md border border-htk-red/30 bg-htk-red/[0.08] text-htk-red">
          {completed ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : unlocked ? (
            <PlayCircle className="h-5 w-5 shrink-0" />
          ) : (
            <Lock className="h-5 w-5 shrink-0" />
          )}
        </div>
      </div>
      <p className="mt-4 min-h-16 text-sm leading-6 text-htk-muted">{module.shortDescription}</p>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-5">
        <span className="inline-flex items-center gap-2 rounded-md border border-htk-red/25 bg-htk-red/[0.06] px-3 py-1 text-xs font-black uppercase text-accent">
          <Dumbbell className="h-3.5 w-3.5" />
          {exerciseCount} exercises
        </span>
        {presetCount > 0 ? (
          <span className="rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs font-black uppercase text-accent/70">
            {presetCount} presets
          </span>
        ) : null}
        {equipmentPreview.map((item) => (
          <span key={item} className="rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs font-black uppercase text-accent/65">
            {item}
          </span>
        ))}
      </div>
      <ButtonLink href={unlocked ? `/module/${module.id}` : "/checkout"} variant={unlocked ? "solid" : "outline"} className="mt-6 w-full">
        {unlocked ? "Open Module" : "Unlock"}
      </ButtonLink>
    </article>
  );
}
