"use client";

import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trainingGoals, type TrainingGoalId } from "@/lib/training-builder-data";
import { cn } from "@/lib/utils";

export function GoalSelector({
  selectedGoal,
  onSelect
}: {
  selectedGoal: TrainingGoalId | null;
  onSelect: (goalId: TrainingGoalId) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Target className="h-5 w-5 text-accent/55" />
        <div>
          <p className="text-xs font-black uppercase text-accent/45">Step 1</p>
          <h2 className="text-2xl font-black">Choose Goal</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {trainingGoals.map((goal) => {
          const isSelected = selectedGoal === goal.id;

          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => onSelect(goal.id)}
              className={cn(
                "rounded-md border p-5 text-left transition hover:border-accent/50 hover:bg-white/[0.03]",
                isSelected ? "border-accent/80 bg-accent/[0.08]" : "border-white/10 bg-background"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <Badge>{isSelected ? "Selected" : "Goal"}</Badge>
                <span className="text-[10px] font-black uppercase text-accent/35">HTK</span>
              </div>
              <h3 className="mt-4 text-xl font-black">{goal.title}</h3>
              <p className="mt-3 text-sm leading-6 text-accent/60">{goal.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
