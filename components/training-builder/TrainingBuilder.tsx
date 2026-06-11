"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultySelector } from "@/components/training-builder/DifficultySelector";
import { EquipmentSelector } from "@/components/training-builder/EquipmentSelector";
import { ExerciseSelector } from "@/components/training-builder/ExerciseSelector";
import { GoalSelector } from "@/components/training-builder/GoalSelector";
import { ModuleSelector } from "@/components/training-builder/ModuleSelector";
import { StepProgress, type BuilderStep } from "@/components/training-builder/StepProgress";
import { WorkoutSummary } from "@/components/training-builder/WorkoutSummary";
import {
  filterBuilderExercises,
  getBuilderModules,
  trainingGoals,
  type BuilderDifficulty,
  type EquipmentOption,
  type TrainingGoalId
} from "@/lib/training-builder-data";

const builderSteps: BuilderStep[] = [
  { id: "goal", label: "Goal", eyebrow: "Step 1" },
  { id: "equipment", label: "Equipment", eyebrow: "Step 2" },
  { id: "module", label: "Focus", eyebrow: "Step 3" },
  { id: "difficulty", label: "Difficulty", eyebrow: "Step 4" },
  { id: "exercises", label: "Exercises", eyebrow: "Step 5" },
  { id: "summary", label: "Summary", eyebrow: "Step 6" }
];

export function TrainingBuilder() {
  const builderModules = useMemo(() => getBuilderModules(), []);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<TrainingGoalId | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentOption[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<BuilderDifficulty | null>(null);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  const filteredExercises = useMemo(
    () =>
      filterBuilderExercises({
        goalId: selectedGoal,
        equipment: selectedEquipment,
        moduleId: selectedModuleId,
        difficulty: selectedDifficulty
      }),
    [selectedDifficulty, selectedEquipment, selectedGoal, selectedModuleId]
  );

  const selectedGoalTitle = trainingGoals.find((goal) => goal.id === selectedGoal)?.title ?? "";
  const selectedModule = builderModules.find((trainingModule) => trainingModule.id === selectedModuleId) ?? null;
  const validSelectedExerciseIds = selectedExerciseIds.filter((exerciseId) =>
    filteredExercises.some((exercise) => exercise.id === exerciseId)
  );
  const selectedExercises = filteredExercises.filter((exercise) => validSelectedExerciseIds.includes(exercise.id));

  const canContinue =
    (currentStep === 0 && Boolean(selectedGoal)) ||
    (currentStep === 1 && selectedEquipment.length > 0) ||
    (currentStep === 2 && Boolean(selectedModuleId)) ||
    (currentStep === 3 && Boolean(selectedDifficulty)) ||
    (currentStep === 4 && validSelectedExerciseIds.length > 0) ||
    currentStep === 5;

  function handleEquipmentToggle(equipment: EquipmentOption) {
    setSelectedEquipment((current) => {
      if (equipment === "No Equipment") {
        return current.includes("No Equipment") ? [] : ["No Equipment"];
      }

      const withoutNoEquipment = current.filter((item) => item !== "No Equipment");

      if (withoutNoEquipment.includes(equipment)) {
        return withoutNoEquipment.filter((item) => item !== equipment);
      }

      return [...withoutNoEquipment, equipment];
    });
  }

  function handleExerciseToggle(exerciseId: string) {
    setSelectedExerciseIds((current) =>
      current.includes(exerciseId) ? current.filter((id) => id !== exerciseId) : [...current, exerciseId]
    );
  }

  function handleSelectAllDisplayed() {
    setSelectedExerciseIds(filteredExercises.map((exercise) => exercise.id));
  }

  function handleReset() {
    setCurrentStep(0);
    setSelectedGoal(null);
    setSelectedEquipment([]);
    setSelectedModuleId(null);
    setSelectedDifficulty(null);
    setSelectedExerciseIds([]);
  }

  function renderStep() {
    if (currentStep === 0) {
      return <GoalSelector selectedGoal={selectedGoal} onSelect={setSelectedGoal} />;
    }

    if (currentStep === 1) {
      return <EquipmentSelector selectedEquipment={selectedEquipment} onToggle={handleEquipmentToggle} />;
    }

    if (currentStep === 2) {
      return (
        <ModuleSelector modules={builderModules} selectedModuleId={selectedModuleId} onSelect={setSelectedModuleId} />
      );
    }

    if (currentStep === 3) {
      return <DifficultySelector selectedDifficulty={selectedDifficulty} onSelect={setSelectedDifficulty} />;
    }

    if (currentStep === 4 && selectedDifficulty) {
      return (
        <ExerciseSelector
          exercises={filteredExercises}
          selectedExerciseIds={validSelectedExerciseIds}
          selectedDifficulty={selectedDifficulty}
          onToggleExercise={handleExerciseToggle}
          onSelectAll={handleSelectAllDisplayed}
          onClearSelection={() => setSelectedExerciseIds([])}
        />
      );
    }

    if (currentStep === 5 && selectedModule && selectedDifficulty) {
      return (
        <WorkoutSummary
          goalTitle={selectedGoalTitle}
          equipment={selectedEquipment}
          trainingModule={selectedModule}
          difficulty={selectedDifficulty}
          exercises={selectedExercises}
        />
      );
    }

    return null;
  }

  return (
    <section className="rounded-md border border-white/10 bg-primary p-5 shadow-premium md:p-7">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">HTK Training Builder</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl">Build a performance session</h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-accent/60 sm:text-base">
            Choose the goal, available equipment, training focus, difficulty, and exercises. The builder returns a clean
            workout brief designed for disciplined execution.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mt-7">
        <StepProgress steps={builderSteps} currentStep={currentStep} />
      </div>

      <div className="mt-7 rounded-md border border-white/10 bg-[#0d0d0d] p-5 md:p-6">{renderStep()}</div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-accent/45 sm:block">
            {currentStep + 1} of {builderSteps.length}
          </p>
          <Button
            type="button"
            onClick={() => setCurrentStep((step) => Math.min(step + 1, builderSteps.length - 1))}
            disabled={!canContinue || currentStep === builderSteps.length - 1}
          >
            {currentStep === builderSteps.length - 2 ? "Build Summary" : "Continue"}
          </Button>
        </div>
      </div>
    </section>
  );
}
