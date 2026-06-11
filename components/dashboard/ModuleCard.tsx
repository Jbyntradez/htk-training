import {
  Activity,
  BadgeCheck,
  CheckCircle2,
  Dumbbell,
  Gauge,
  ListChecks,
  Lock,
  PlayCircle,
  ShieldCheck,
  Target,
  Timer,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Microcopy } from "@/components/ui/microcopy";
import type { Module } from "@/lib/content";
import { getHTKTrainingModule } from "@/lib/htk-training-library";

const moduleIcons: Record<string, LucideIcon> = {
  "flexibility-mobility": Activity,
  "core-strength-stability": ShieldCheck,
  "cardio-endurance": Timer,
  "balance-body-control": Target,
  "plyometrics-explosiveness": Zap,
  "speed-agility-quickness": Activity,
  "resistance-functional-strength": Dumbbell,
  "durability-recovery": ShieldCheck,
  "real-world-performance-workouts": BadgeCheck
};

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
  const equipmentPreview = libraryModule?.equipmentOptions.slice(0, 3) ?? module.equipmentNeeded.slice(0, 3);
  const ModuleIcon = moduleIcons[module.id] ?? Dumbbell;

  return (
    <article className="htk-card h-full p-5 htk-card-hover md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md border border-htk-red/30 bg-htk-red/[0.08] px-3 py-1 text-xs font-black uppercase text-accent">
            <Gauge className="h-3.5 w-3.5 text-htk-red" />
            {module.difficultyLevel}
          </span>
          <h3 className="mt-3 text-2xl font-black leading-tight text-accent">{module.title}</h3>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-md border border-htk-red/30 bg-htk-red/[0.08] text-htk-red">
          {completed ? (
            <CheckCircle2 className="h-6 w-6 shrink-0" />
          ) : unlocked ? (
            <ModuleIcon className="h-6 w-6 shrink-0" />
          ) : (
            <Lock className="h-6 w-6 shrink-0" />
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
          <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs font-black uppercase text-accent/70">
            <ListChecks className="h-3.5 w-3.5 text-htk-red" />
            {presetCount} presets
          </span>
        ) : null}
        {equipmentPreview.map((item) => (
          <span key={item} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/35 px-3 py-1 text-xs font-black uppercase text-accent/65">
            <Dumbbell className="h-3.5 w-3.5 text-htk-red" />
            {item}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <Microcopy
          label="Tile signals"
          id={`module-${module.id}-tile-signals`}
          description="The icon shows training focus, the level badge shows expected complexity, and chips show available exercises, presets, and common equipment before you open the module."
          icon={<PlayCircle className="h-3.5 w-3.5" />}
        />
      </div>
      <ButtonLink href={unlocked ? `/module/${module.id}` : "/checkout"} variant={unlocked ? "solid" : "outline"} className="mt-6 w-full">
        {unlocked ? "Open Module" : "Unlock"}
      </ButtonLink>
    </article>
  );
}
