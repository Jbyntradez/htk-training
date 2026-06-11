"use client";

import { Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { difficultyOptions, type BuilderDifficulty } from "@/lib/training-builder-data";
import { cn } from "@/lib/utils";

const difficultyDescriptions: Record<BuilderDifficulty, string> = {
  Beginner: "Own positions, move cleanly, and keep intensity controlled.",
  Intermediate: "Add more output, sharper execution, and moderate complexity.",
  Advanced: "Use higher intent, tighter rest windows, and more demanding progressions."
};

export function DifficultySelector({
  selectedDifficulty,
  onSelect,
  options = difficultyOptions,
  stepLabel = "Step 4"
}: {
  selectedDifficulty: BuilderDifficulty | null;
  onSelect: (difficulty: BuilderDifficulty) => void;
  options?: readonly BuilderDifficulty[];
  stepLabel?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Gauge className="h-5 w-5 text-accent/55" />
        <div>
          <p className="text-xs font-black uppercase text-accent/45">{stepLabel}</p>
          <h2 className="text-2xl font-black">Choose Difficulty</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {options.map((difficulty) => {
          const isSelected = selectedDifficulty === difficulty;

          return (
            <button
              key={difficulty}
              type="button"
              onClick={() => onSelect(difficulty)}
              className={cn(
                "rounded-md border p-5 text-left transition hover:border-accent/50 hover:bg-white/[0.03]",
                isSelected ? "border-accent/80 bg-accent/[0.08]" : "border-white/10 bg-background"
              )}
            >
              <Badge>{isSelected ? "Selected" : "Level"}</Badge>
              <h3 className="mt-4 text-xl font-black">{difficulty}</h3>
              <p className="mt-3 text-sm leading-6 text-accent/60">{difficultyDescriptions[difficulty]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
