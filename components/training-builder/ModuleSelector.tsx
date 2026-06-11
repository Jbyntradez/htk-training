"use client";

import { Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TrainingModule } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ModuleSelector({
  modules,
  selectedModuleId,
  onSelect
}: {
  modules: TrainingModule[];
  selectedModuleId: string | null;
  onSelect: (moduleId: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Layers3 className="h-5 w-5 text-accent/55" />
        <div>
          <p className="text-xs font-black uppercase text-accent/45">Step 3</p>
          <h2 className="text-2xl font-black">Choose Training Focus</h2>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((trainingModule) => {
          const isSelected = selectedModuleId === trainingModule.id;

          return (
            <button
              key={trainingModule.id}
              type="button"
              onClick={() => onSelect(trainingModule.id)}
              className={cn(
                "rounded-md border p-5 text-left transition hover:border-accent/50 hover:bg-white/[0.03]",
                isSelected ? "border-accent/80 bg-accent/[0.08]" : "border-white/10 bg-background"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <Badge>{trainingModule.exercises.length} exercises</Badge>
                <span className="text-[10px] font-black uppercase text-accent/35">
                  {isSelected ? "Selected" : trainingModule.difficultyLevel}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-black">{trainingModule.title}</h3>
              <p className="mt-3 text-sm leading-6 text-accent/60">{trainingModule.shortDescription}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
