"use client";

import { CheckCircle2, CirclePlus, ListChecks, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoPlaceholder } from "@/components/modules/VideoPlaceholder";
import type { BuilderDifficulty, BuilderExercise } from "@/lib/training-builder-data";
import { cn } from "@/lib/utils";

const modificationKey: Record<BuilderDifficulty, "beginner" | "intermediate" | "advanced"> = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced"
};

function BulletList({ items, tone = "default" }: { items: string[]; tone?: "default" | "warning" | "safe" }) {
  return (
    <ul className="mt-3 grid gap-2 text-sm leading-6 text-accent/65">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span
            className={cn(
              "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/35",
              tone === "warning" && "bg-red-300/75",
              tone === "safe" && "bg-emerald-300/75"
            )}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ExerciseCard({
  exercise,
  selected,
  selectedDifficulty,
  onToggle
}: {
  exercise: BuilderExercise;
  selected: boolean;
  selectedDifficulty: BuilderDifficulty;
  onToggle: (exerciseId: string) => void;
}) {
  const selectedModification = exercise.modifications[modificationKey[selectedDifficulty]];

  return (
    <article
      data-testid={`exercise-card-${exercise.id}`}
      className={cn(
        "htk-card p-5",
        selected ? "border-htk-red/80 bg-htk-red/[0.08]" : "htk-card-hover"
      )}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-htk-red/30 bg-htk-red/[0.08]">{exercise.moduleTitle}</Badge>
            <Badge>{exercise.category}</Badge>
            <Badge>{selectedDifficulty}</Badge>
            <Badge>{exercise.recommended}</Badge>
          </div>
          <h3 className="mt-4 text-3xl font-black leading-tight text-accent">{exercise.name}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-htk-muted">{exercise.explanation}</p>
        </div>
        <Button
          type="button"
          data-testid={`exercise-action-${exercise.id}`}
          variant={selected ? "solid" : "outline"}
          onClick={() => onToggle(exercise.id)}
          aria-pressed={selected}
          className="shrink-0 gap-2"
        >
          {selected ? <CheckCircle2 className="h-4 w-4" /> : <CirclePlus className="h-4 w-4" />}
          {selected ? "Added" : "Add to Workout"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Equipment</p>
          <p className="mt-2 text-sm font-bold text-accent/85">{exercise.equipment.join(", ")}</p>
        </div>
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Primary Muscles</p>
          <p className="mt-2 text-sm font-bold text-accent/85">{exercise.primaryMuscles.join(", ")}</p>
        </div>
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Movement Pattern</p>
          <p className="mt-2 text-sm font-bold text-accent/85">{exercise.movementPattern}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Secondary Muscles</p>
          <p className="mt-2 text-sm font-bold text-accent/85">{exercise.secondaryMuscles.join(", ")}</p>
        </div>
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Training Goal</p>
          <p className="mt-2 text-sm font-bold text-accent/85">{exercise.trainingGoal}</p>
        </div>
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Estimated Time / Version</p>
          <p className="mt-2 text-sm font-bold text-accent/85">
            {exercise.estimatedMinutes} min - {selectedModification}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <VideoPlaceholder title={exercise.name} videoUrl={exercise.videoUrl} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="htk-subcard p-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-htk-red" />
            <h4 className="font-black text-accent">Coaching Cues</h4>
          </div>
          <BulletList items={exercise.coachingCues} tone="safe" />
        </section>

        <section className="rounded-md border border-htk-red/25 bg-htk-red/[0.05] p-4">
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-4 w-4 text-htk-red" />
            <h4 className="font-black text-accent">Common Mistakes</h4>
          </div>
          <BulletList items={exercise.commonMistakes} tone="warning" />
        </section>
      </div>

      <section className="mt-5">
        <h4 className="font-black uppercase text-accent">Beginner / Intermediate / Advanced</h4>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          <div
            className={cn(
              "rounded-md border p-4",
              selectedDifficulty === "Beginner"
                ? "border-htk-red/70 bg-htk-red/[0.08]"
                : "border-white/10 bg-black/35"
            )}
          >
            <p className="text-xs font-black uppercase text-htk-red">Beginner Modification</p>
            <p className="mt-2 text-sm leading-6 text-htk-muted">{exercise.modifications.beginner}</p>
          </div>
          <div
            className={cn(
              "rounded-md border p-4",
              selectedDifficulty === "Intermediate"
                ? "border-htk-red/70 bg-htk-red/[0.08]"
                : "border-white/10 bg-black/35"
            )}
          >
            <p className="text-xs font-black uppercase text-htk-red">Intermediate Version</p>
            <p className="mt-2 text-sm leading-6 text-htk-muted">{exercise.modifications.intermediate}</p>
          </div>
          <div
            className={cn(
              "rounded-md border p-4",
              selectedDifficulty === "Advanced"
                ? "border-htk-red/70 bg-htk-red/[0.08]"
                : "border-white/10 bg-black/35"
            )}
          >
            <p className="text-xs font-black uppercase text-htk-red">Advanced Version</p>
            <p className="mt-2 text-sm leading-6 text-htk-muted">{exercise.modifications.advanced}</p>
          </div>
        </div>
      </section>
    </article>
  );
}
