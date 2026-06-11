"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type BuilderStep = {
  id: string;
  label: string;
  eyebrow: string;
};

export function StepProgress({ steps, currentStep }: { steps: BuilderStep[]; currentStep: number }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              "rounded-md border p-3 transition",
              isActive && "border-accent/70 bg-accent/[0.08]",
              isComplete && "border-emerald-300/25 bg-emerald-300/[0.06]",
              !isActive && !isComplete && "border-white/10 bg-background"
            )}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase text-accent/45">{step.eyebrow}</span>
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-black",
                  isActive && "border-accent bg-accent text-background",
                  isComplete && "border-emerald-300/50 bg-emerald-300/20 text-emerald-100",
                  !isActive && !isComplete && "border-white/10 text-accent/45"
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
            </div>
            <p className="mt-2 text-sm font-black text-accent">{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}
