"use client";

import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExerciseCard } from "@/components/training-builder/ExerciseCard";
import type { BuilderDifficulty, BuilderExercise } from "@/lib/training-builder-data";

export function ExerciseSelector({
  exercises,
  selectedExerciseIds,
  selectedDifficulty,
  onToggleExercise,
  onSelectAll,
  onClearSelection,
  stepLabel = "Step 5"
}: {
  exercises: BuilderExercise[];
  selectedExerciseIds: string[];
  selectedDifficulty: BuilderDifficulty;
  onToggleExercise: (exerciseId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  stepLabel?: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-accent/55" />
          <div>
            <p className="text-xs font-black uppercase text-accent/45">{stepLabel}</p>
            <h2 className="text-2xl font-black">Choose Exercises</h2>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onSelectAll} disabled={exercises.length === 0}>
            Select All Displayed
          </Button>
          <Button type="button" variant="ghost" onClick={onClearSelection} disabled={selectedExerciseIds.length === 0}>
            Clear
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-white/10 bg-primary p-4">
        <p className="text-sm leading-6 text-accent/65">
          Showing exercises that match the selected goal, equipment, module, and difficulty. Choose the movements that
          belong in this workout brief.
        </p>
      </div>

      {exercises.length === 0 ? (
        <div className="mt-5 rounded-md border border-amber-300/20 bg-amber-300/[0.06] p-5">
          <p className="font-black text-accent">No exact exercise match found.</p>
          <p className="mt-2 text-sm leading-6 text-accent/65">
            Adjust equipment, difficulty, or training focus. HTK keeps the filter strict so the final workout reflects
            the available tools and selected intent.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              selected={selectedExerciseIds.includes(exercise.id)}
              selectedDifficulty={selectedDifficulty}
              onToggle={onToggleExercise}
            />
          ))}
        </div>
      )}
    </div>
  );
}
