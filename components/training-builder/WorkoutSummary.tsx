"use client";

import { FileDown, Save, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrainingModule } from "@/lib/content";
import type { BuilderDifficulty, BuilderExercise, EquipmentOption } from "@/lib/training-builder-data";

type SummaryExercise = BuilderExercise & {
  presetPrescription?: string;
  presetCoachingNote?: string;
};

export function WorkoutSummary({
  goalTitle,
  equipment,
  trainingModule,
  difficulty,
  exercises,
  stepLabel = "Step 6",
  title = "Workout Summary",
  description = "Review the completed HTK workout brief before saving, assigning, or exporting.",
  estimatedDuration,
  coachingNotes = [],
  safetyNotes = [],
  modificationOptions
}: {
  goalTitle: string;
  equipment: EquipmentOption[];
  trainingModule: TrainingModule;
  difficulty: BuilderDifficulty;
  exercises: SummaryExercise[];
  stepLabel?: string;
  title?: string;
  description?: string;
  estimatedDuration?: string;
  coachingNotes?: string[];
  safetyNotes?: string[];
  modificationOptions?: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}) {
  const totalEstimatedTime = exercises.reduce((total, exercise) => total + exercise.estimatedMinutes, 8);
  const durationLabel = estimatedDuration ?? `${totalEstimatedTime} minutes including warm-up`;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="htk-kicker">{stepLabel}</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-accent sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-htk-muted">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled className="gap-2">
            <Save className="h-4 w-4" />
            Save Workout
          </Button>
          <Button type="button" variant="outline" disabled className="gap-2">
            <FileDown className="h-4 w-4" />
            Print / Export
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="htk-card p-5">
          <h3 className="text-xl font-black uppercase text-accent">Session Brief</h3>
          <div className="mt-4 grid gap-3">
            <SummaryRow label="Selected Goal" value={goalTitle} />
            <SummaryRow label="Equipment" value={equipment.join(", ")} />
            <SummaryRow label="Training Focus" value={trainingModule.title} />
            <SummaryRow label="Difficulty" value={difficulty} />
            <SummaryRow label="Total Estimated Time" value={durationLabel} />
          </div>
        </section>

        <section className="htk-card p-5">
          <h3 className="text-xl font-black uppercase text-accent">Suggested Order</h3>
          <ol className="mt-4 grid gap-3">
            <li className="rounded-md border border-htk-red/25 bg-htk-red/[0.06] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black uppercase text-accent">Warm-Up Reminder</p>
                  <p className="mt-2 text-sm leading-6 text-htk-muted">
                    Use 5-8 minutes of easy movement, breathing, mobility, and progressive intensity before the first
                    work set.
                  </p>
                </div>
                <Badge>Prep</Badge>
              </div>
            </li>
            {exercises.map((exercise, index) => (
              <li key={exercise.id} className="rounded-md border border-white/10 bg-black/35 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase text-htk-red">Block {index + 1}</p>
                    <p className="mt-1 font-black text-accent">{exercise.name}</p>
                    <p className="mt-2 text-sm leading-6 text-htk-muted">
                      {exercise.presetPrescription ?? exercise.recommended}
                    </p>
                    {exercise.presetCoachingNote ? (
                      <p className="mt-2 text-xs leading-5 text-accent/45">{exercise.presetCoachingNote}</p>
                    ) : null}
                  </div>
                  <Badge>{exercise.estimatedMinutes} min</Badge>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {coachingNotes.length > 0 || modificationOptions ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {coachingNotes.length > 0 ? (
            <section className="htk-card p-5">
              <h3 className="text-xl font-black uppercase text-accent">Coaching Notes</h3>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-htk-muted">
                {coachingNotes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-htk-red" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {modificationOptions ? (
            <section className="htk-card p-5">
              <h3 className="text-xl font-black uppercase text-accent">Modification Options</h3>
              <div className="mt-3 grid gap-2">
                <SummaryRow label="Beginner" value={modificationOptions.beginner} />
                <SummaryRow label="Intermediate" value={modificationOptions.intermediate} />
                <SummaryRow label="Advanced" value={modificationOptions.advanced} />
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      <div className="htk-danger-note mt-5 p-5">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-htk-red" />
          <div className="grid gap-2 text-sm leading-6 text-accent/75">
            <p>
              Safety note: This builder provides general performance training guidance. It does not diagnose injuries,
              prescribe medical treatment, or replace care from a qualified professional. Stop or modify any exercise
              that creates concerning pain, symptoms, or unsafe movement.
            </p>
            {safetyNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/35 p-4">
      <p className="text-xs font-black uppercase text-htk-red">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-accent/85">{value}</p>
    </div>
  );
}
