"use client";

import type { ReactNode } from "react";
import { ChevronDown, Clock, Dumbbell, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ModuleWorkoutBuilder, PresetWorkout } from "@/lib/training-builder-data";
import { cn } from "@/lib/utils";

export function PresetWorkoutCard({
  builder,
  preset,
  selected,
  onPreview
}: {
  builder: ModuleWorkoutBuilder;
  preset: PresetWorkout;
  selected: boolean;
  onPreview: (presetId: string) => void;
}) {
  return (
    <article
      data-testid={`preset-card-${preset.id}`}
      className={cn(
        "htk-card p-5",
        selected ? "border-htk-red/80 bg-htk-red/[0.08]" : "htk-card-hover"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge className="border-htk-red/30 bg-htk-red/[0.08]">{preset.difficulty}</Badge>
          <h3 className="mt-3 text-3xl font-black leading-tight text-accent">{preset.title}</h3>
          <p className="mt-3 text-sm leading-6 text-htk-muted">{preset.purpose}</p>
        </div>
        <Button
          type="button"
          data-testid={`preset-action-${preset.id}`}
          variant={selected ? "solid" : "outline"}
          onClick={() => onPreview(preset.id)}
        >
          {selected ? "Hide Workout" : "View Workout"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Metric icon={<Gauge className="h-4 w-4" />} label="Difficulty" value={preset.difficulty} />
        <Metric icon={<Clock className="h-4 w-4" />} label="Duration" value={preset.estimatedDuration} />
        <Metric icon={<Dumbbell className="h-4 w-4" />} label="Equipment" value={preset.equipment.join(", ")} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Training Goal</p>
          <p className="mt-2 text-sm font-bold leading-6 text-accent/85">{preset.trainingGoal}</p>
        </div>
        <div className="htk-subcard p-4">
          <p className="text-xs font-black uppercase text-htk-red">Target Muscles</p>
          <p className="mt-2 text-sm font-bold leading-6 text-accent/85">{preset.targetMuscles.join(", ")}</p>
        </div>
      </div>

      <details className="group mt-5 rounded-md border border-white/10 bg-black/35">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-black uppercase text-accent/85 transition hover:text-white">
          Preset Workout Details
          <ChevronDown className="h-4 w-4 text-htk-red transition group-open:rotate-180" />
        </summary>
        <div className="grid gap-5 border-t border-white/10 p-4">
          <section>
            <h4 className="font-black">Exercise List</h4>
            <ol className="mt-3 grid gap-3">
              {preset.exercises.map((presetExercise, index) => {
                const exercise = builder.exercises.find((item) => item.id === presetExercise.exerciseId);

                return (
                  <li key={presetExercise.exerciseId} className="rounded-md border border-white/10 bg-black/35 p-3">
                    <p className="text-xs font-black uppercase text-htk-red">Block {index + 1}</p>
                    <p className="mt-1 font-black text-accent">{exercise?.name ?? presetExercise.exerciseId}</p>
                    <p className="mt-2 text-sm leading-6 text-htk-muted">{presetExercise.prescription}</p>
                    <p className="mt-2 text-xs leading-5 text-accent/50">{presetExercise.coachingNote}</p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <NoteList title="Coaching Notes" items={preset.coachingNotes} />
            <NoteList title="Safety Notes" items={preset.safetyNotes} />
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <NoteList title="Warmup" items={preset.warmup} />
            <NoteList title="Cooldown" items={preset.cooldown} />
          </section>

          <section>
            <h4 className="font-black">Progression Options</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {preset.progressionOptions.map((option) => (
                <Modification key={option} label="Progression" value={option} />
              ))}
            </div>
          </section>
        </div>
      </details>
    </article>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="htk-subcard p-4">
      <div className="text-htk-red">{icon}</div>
      <p className="mt-3 text-xs font-black uppercase text-htk-red">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-accent/85">{value}</p>
    </div>
  );
}

function NoteList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-black">{title}</h4>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-htk-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-htk-red" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Modification({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/35 p-3">
      <p className="text-xs font-black uppercase text-htk-red">{label}</p>
      <p className="mt-2 text-sm leading-6 text-htk-muted">{value}</p>
    </div>
  );
}
