import {
  getHTKTrainingModule,
  getPresetWorkoutExercises,
  htkDifficultyOptions,
  htkExercises,
  htkPresetWorkouts,
  htkTrainingModules,
  type HTKDifficulty,
  type HTKExercise,
  type HTKPresetWorkout,
  type HTKTrainingModuleLibrary
} from "@/lib/htk-training-library";
import type { TrainingModule } from "@/lib/content";
import { modules } from "@/lib/content";

export const trainingGoals = [
  {
    id: "build-explosiveness",
    title: "Build Explosiveness",
    description: "Prioritize force production, jumps, acceleration, and powerful intent."
  },
  {
    id: "improve-endurance",
    title: "Improve Endurance",
    description: "Build repeatable output and conditioning without turning every session into a test."
  },
  {
    id: "increase-mobility",
    title: "Increase Mobility",
    description: "Improve usable range of motion, positions, and movement quality."
  },
  {
    id: "build-functional-strength",
    title: "Build Functional Strength",
    description: "Build strength that carries into sport, duty, and real-world movement."
  },
  {
    id: "improve-athleticism",
    title: "Improve Athleticism",
    description: "Blend coordination, control, power, speed, and usable movement."
  },
  {
    id: "improve-durability",
    title: "Improve Durability",
    description: "Build resilient positions, tissue capacity, and repeatable mechanics."
  },
  {
    id: "real-world-performance",
    title: "Real-World Performance",
    description: "Prepare for demanding, mixed-output work under fatigue and pressure."
  }
] as const;

export const equipmentOptions = [
  "Bodyweight",
  "Dumbbells",
  "Kettlebell",
  "Barbell",
  "Bands",
  "Medicine Ball",
  "Pull-Up Bar",
  "Bench",
  "Sled",
  "Cones",
  "Jump Rope",
  "No Equipment"
] as const;

export const difficultyOptions = htkDifficultyOptions;

export type TrainingGoalId = (typeof trainingGoals)[number]["id"];
export type EquipmentOption = string;
export type BuilderDifficulty = HTKDifficulty;
export type BuilderExercise = HTKExercise & {
  goalTags?: TrainingGoalId[];
};
export type PresetWorkout = HTKPresetWorkout;
export type PresetWorkoutExercise = HTKPresetWorkout["exercises"][number];
export type ModuleWorkoutBuilder = HTKTrainingModuleLibrary;

export type BuilderFilters = {
  goalId: TrainingGoalId | null;
  equipment: EquipmentOption[];
  moduleId: string | null;
  difficulty: BuilderDifficulty | null;
};

export function getBuilderModules(): TrainingModule[] {
  return modules;
}

export function getBuilderExercises(): BuilderExercise[] {
  return htkExercises;
}

export function getBuilderExercisesForModule(moduleId: string): BuilderExercise[] {
  return htkExercises.filter((exercise) => exercise.moduleId === moduleId);
}

export function filterBuilderExercises(filters: BuilderFilters): BuilderExercise[] {
  return htkExercises.filter((exercise) => {
    const matchesEquipment =
      filters.equipment.length === 0 || filters.equipment.some((equipment) => exercise.equipment.includes(equipment));
    const matchesModule = !filters.moduleId || exercise.moduleId === filters.moduleId;
    const matchesDifficulty = !filters.difficulty || exercise.difficulty.includes(filters.difficulty);

    return matchesEquipment && matchesModule && matchesDifficulty;
  });
}

export function getModuleWorkoutBuilder(moduleId: string): ModuleWorkoutBuilder | undefined {
  return getHTKTrainingModule(moduleId);
}

export { getPresetWorkoutExercises, htkExercises, htkPresetWorkouts, htkTrainingModules };
