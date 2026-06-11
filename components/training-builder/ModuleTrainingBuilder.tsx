"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Dumbbell, ListChecks, RotateCcw, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Microcopy } from "@/components/ui/microcopy";
import { ExerciseCard } from "@/components/training-builder/ExerciseCard";
import { PresetWorkoutCard } from "@/components/training-builder/PresetWorkoutCard";
import { WorkoutSummary } from "@/components/training-builder/WorkoutSummary";
import type { TrainingModule } from "@/lib/content";
import {
  getPresetWorkoutExercises,
  type BuilderDifficulty,
  type ModuleWorkoutBuilder
} from "@/lib/training-builder-data";
import { cn } from "@/lib/utils";

type FilterState = {
  search: string;
  muscle: string | null;
  equipment: string | null;
  difficulty: BuilderDifficulty | null;
  trainingGoal: string | null;
  duration: string | null;
  movementPattern: string | null;
};

const emptyFilters: FilterState = {
  search: "",
  muscle: null,
  equipment: null,
  difficulty: null,
  trainingGoal: null,
  duration: null,
  movementPattern: null
};

export function ModuleTrainingBuilder({
  trainingModule,
  builder
}: {
  trainingModule: TrainingModule;
  builder: ModuleWorkoutBuilder;
}) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("preset-workouts");

  const filteredExercises = useMemo(() => {
    const searchValue = filters.search.trim().toLowerCase();

    return builder.exercises.filter((exercise) => {
      const searchableText = [
        exercise.name,
        exercise.category,
        exercise.trainingGoal,
        exercise.movementPattern,
        ...exercise.primaryMuscles,
        ...exercise.secondaryMuscles,
        ...exercise.equipment
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !searchValue || searchableText.includes(searchValue);
      const matchesMuscle =
        !filters.muscle ||
        exercise.primaryMuscles.includes(filters.muscle) ||
        exercise.secondaryMuscles.includes(filters.muscle);
      const matchesEquipment = !filters.equipment || exercise.equipment.includes(filters.equipment);
      const matchesDifficulty = !filters.difficulty || exercise.difficulty.includes(filters.difficulty);
      const matchesGoal = !filters.trainingGoal || exercise.trainingGoal === filters.trainingGoal;
      const matchesDuration = !filters.duration || durationBucket(exercise.estimatedMinutes) === filters.duration;
      const matchesPattern = !filters.movementPattern || exercise.movementPattern === filters.movementPattern;

      return (
        matchesSearch &&
        matchesMuscle &&
        matchesEquipment &&
        matchesDifficulty &&
        matchesGoal &&
        matchesDuration &&
        matchesPattern
      );
    });
  }, [builder.exercises, filters]);

  const filteredPresets = useMemo(() => {
    const searchValue = filters.search.trim().toLowerCase();

    return builder.presetWorkouts.filter((preset) => {
      const presetExercises = getPresetWorkoutExercises(builder, preset);
      const presetPatterns = presetExercises.map((exercise) => exercise.movementPattern);
      const searchableText = [
        preset.title,
        preset.description,
        preset.trainingGoal,
        ...preset.targetMuscles,
        ...preset.equipment,
        ...presetPatterns
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !searchValue || searchableText.includes(searchValue);
      const matchesMuscle = !filters.muscle || preset.targetMuscles.includes(filters.muscle);
      const matchesEquipment = !filters.equipment || preset.equipment.includes(filters.equipment);
      const matchesDifficulty = !filters.difficulty || preset.difficulty === filters.difficulty;
      const matchesGoal = !filters.trainingGoal || preset.trainingGoal === filters.trainingGoal;
      const matchesDuration = !filters.duration || preset.durationBucket === filters.duration;
      const matchesPattern = !filters.movementPattern || presetPatterns.includes(filters.movementPattern);

      return (
        matchesSearch &&
        matchesMuscle &&
        matchesEquipment &&
        matchesDifficulty &&
        matchesGoal &&
        matchesDuration &&
        matchesPattern
      );
    });
  }, [builder, filters]);

  const selectedExercises = builder.exercises.filter((exercise) => selectedExerciseIds.includes(exercise.id));
  const summaryDifficulty = filters.difficulty ?? "Intermediate";
  const summaryEquipment = filters.equipment ? [filters.equipment] : ["Filtered module selection"];

  function updateFilter<Key extends keyof FilterState>(key: Key, value: FilterState[Key]) {
    setFilters((current) => ({ ...current, [key]: current[key] === value ? null : value }));
  }

  function handleSearch(value: string) {
    setFilters((current) => ({ ...current, search: value }));
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setSelectedPresetId(null);
  }

  function toggleExercise(exerciseId: string) {
    setSelectedExerciseIds((current) =>
      current.includes(exerciseId) ? current.filter((id) => id !== exerciseId) : [...current, exerciseId]
    );
  }

  return (
    <section className="mt-10 grid gap-10">
      <div className="htk-panel overflow-hidden p-6 md:p-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="htk-red-rule" />
            <p className="htk-kicker mt-5">Module workout builder</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-accent">Build inside {builder.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-htk-muted">{builder.description}</p>
            <p className="mt-3 max-w-3xl text-sm font-bold uppercase leading-6 text-accent/80">
              Move well. Hit hard. Last longer. Recover smarter.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="border-htk-red/30 bg-htk-red/[0.08] text-accent">{builder.exercises.length} exercises</Badge>
            <Badge className="border-htk-red/30 bg-htk-red/[0.08] text-accent">{builder.presetWorkouts.length} presets</Badge>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-3">
          <ActionPath
            href="#preset-workouts"
            icon={<ListChecks className="h-5 w-5" />}
            title="Preset Workouts"
            copy="Start with an HTK-built session and execute with standards."
            active={activeSection === "preset-workouts"}
            onActivate={() => setActiveSection("preset-workouts")}
          />
          <ActionPath
            href="#exercise-library"
            icon={<Dumbbell className="h-5 w-5" />}
            title="Browse Exercises"
            copy="Review cues, modifications, video placeholders, and safety notes."
            active={activeSection === "exercise-library"}
            onActivate={() => setActiveSection("exercise-library")}
          />
          <ActionPath
            href="#build-custom-workout"
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Build Custom Workout"
            copy="Select module-specific movements and generate a clean workout brief."
            active={activeSection === "build-custom-workout"}
            onActivate={() => setActiveSection("build-custom-workout")}
          />
        </div>

        <nav className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5" aria-label={`${builder.title} module sections`}>
          {[
            { href: "#muscle-group-filters", label: "Muscle Group Filters" },
            { href: "#preset-workouts", label: "Preset Workouts" },
            { href: "#exercise-library", label: "Exercise Library" },
            { href: "#build-custom-workout", label: "Build Custom Workout" },
            { href: "#workout-summary", label: "Workout Summary" }
          ].map((item) => {
            const sectionId = item.href.slice(1);
            const active = activeSection === sectionId;

            return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveSection(sectionId)}
              aria-current={active ? "location" : undefined}
              aria-label={`Jump to ${item.label} in ${builder.title}`}
              className={cn(
                "rounded-md border px-3 py-2 text-xs font-black uppercase transition focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
                active
                  ? "border-htk-red bg-htk-red text-white"
                  : "border-white/10 bg-black/35 text-accent/65 hover:border-htk-red/60 hover:bg-htk-red/[0.08] hover:text-white"
              )}
            >
              {item.label}
            </a>
            );
          })}
        </nav>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {builder.goals.map((goal) => (
            <div key={goal} className="htk-subcard p-4">
              <p className="text-xs font-black uppercase text-htk-red">Module Goal</p>
              <p className="mt-2 text-sm font-bold leading-6 text-accent/85">{goal}</p>
            </div>
          ))}
        </div>
      </div>

      <section id="muscle-group-filters" className="htk-panel scroll-mt-24 p-5 md:p-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-htk-red" />
              <p className="htk-kicker">Module filters</p>
            </div>
            <h2 className="htk-section-title mt-2">Find the right work fast</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-htk-muted">
              Filters are specific to {builder.title}. Irrelevant body areas and training styles are intentionally left
              out.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={resetFilters} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-md border border-white/10 bg-black/40 p-3 transition focus-within:border-htk-red/70 focus-within:bg-black/60">
          <Search className="h-4 w-4 shrink-0 text-htk-red" />
          <Input
            value={filters.search}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder={`Search ${builder.title} exercises or workouts`}
            className="border-transparent bg-transparent px-0 focus:border-transparent"
          />
        </div>

        <div className="mt-5 grid gap-5">
          <ChipGroup
            title="Muscle / Body Area"
            testIdPrefix="muscle"
            options={builder.muscleFilters}
            value={filters.muscle}
            onChange={(value) => updateFilter("muscle", value)}
          />
          <ChipGroup
            title="Equipment"
            testIdPrefix="equipment"
            options={builder.equipmentOptions}
            value={filters.equipment}
            onChange={(value) => updateFilter("equipment", value)}
          />
          <ChipGroup
            title="Difficulty"
            testIdPrefix="difficulty"
            options={builder.difficultyOptions}
            value={filters.difficulty}
            onChange={(value) => updateFilter("difficulty", value as BuilderDifficulty)}
          />
          <ChipGroup
            title="Training Goal"
            testIdPrefix="goal"
            options={builder.trainingGoalOptions}
            value={filters.trainingGoal}
            onChange={(value) => updateFilter("trainingGoal", value)}
          />
          <ChipGroup
            title="Duration"
            testIdPrefix="duration"
            options={builder.durationOptions}
            value={filters.duration}
            onChange={(value) => updateFilter("duration", value)}
          />
          <ChipGroup
            title="Movement Pattern"
            testIdPrefix="pattern"
            options={builder.movementPatternOptions}
            value={filters.movementPattern}
            onChange={(value) => updateFilter("movementPattern", value)}
          />
        </div>
      </section>

      <section id="preset-workouts" className="htk-panel scroll-mt-24 p-6 md:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="htk-kicker">Preset workouts</p>
            <h2 className="htk-section-title mt-2">Module-ready sessions</h2>
          </div>
          <p className="text-sm font-bold uppercase text-htk-muted">
            {filteredPresets.length} of {builder.presetWorkouts.length} presets shown
          </p>
        </div>

        <div className="mt-5 grid gap-5">
          {filteredPresets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const presetExercises = isSelected ? getPresetWorkoutExercises(builder, preset) : [];

            return (
              <div key={preset.id} className="grid gap-4">
                <PresetWorkoutCard
                  builder={builder}
                  preset={preset}
                  selected={isSelected}
                  onPreview={(presetId) =>
                    setSelectedPresetId((currentPresetId) => (currentPresetId === presetId ? null : presetId))
                  }
                />

                {isSelected ? (
                  <div
                    data-testid="selected-preset-summary"
                    className="rounded-md border border-htk-red/25 bg-black/45 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.4)] md:p-6"
                  >
                    <WorkoutSummary
                      goalTitle={preset.trainingGoal}
                      equipment={preset.equipment}
                      trainingModule={trainingModule}
                      difficulty={preset.difficulty}
                      exercises={presetExercises}
                      stepLabel="Preset Summary"
                      title={preset.title}
                      description={preset.description}
                      estimatedDuration={preset.estimatedDuration}
                      coachingNotes={preset.coachingNotes}
                      safetyNotes={preset.safetyNotes}
                      modificationOptions={preset.modificationOptions}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {filteredPresets.length === 0 ? (
          <EmptyState
            label="No preset workouts match these filters."
            hint="Clear one filter or choose a broader muscle, equipment, or duration option."
          />
        ) : null}
      </section>

      <section id="exercise-library" className="htk-panel scroll-mt-24 p-6 md:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="htk-kicker">Exercise library</p>
            <h2 className="htk-section-title mt-2">Add exercises to a custom workout</h2>
          </div>
          <div className="flex flex-col gap-2 text-sm font-bold uppercase text-htk-muted sm:items-end">
            <p>
              {filteredExercises.length} of {builder.exercises.length} exercises shown - {selectedExercises.length}{" "}
              selected
            </p>
            {selectedExercises.length > 0 ? (
              <a
                href="#workout-summary"
                className="rounded-sm font-black uppercase text-htk-red hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background"
              >
                View Workout Summary
              </a>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-5">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              selected={selectedExerciseIds.includes(exercise.id)}
              selectedDifficulty={filters.difficulty ?? exercise.difficulty[0]}
              onToggle={toggleExercise}
            />
          ))}
        </div>

        {filteredExercises.length === 0 ? (
          <EmptyState
            label="No exercises match these filters."
            hint="Clear search or loosen one filter to bring module-specific exercises back."
          />
        ) : null}
      </section>

      <section id="build-custom-workout" className="htk-panel scroll-mt-24 p-6 md:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="htk-kicker">Build custom workout</p>
            <h2 className="htk-section-title mt-2">Workout summary</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSelectedExerciseIds([])}
            disabled={selectedExerciseIds.length === 0}
          >
            Clear Selection
          </Button>
        </div>

        <div id="workout-summary" className="scroll-mt-24">
          {selectedExercises.length > 0 ? (
            <div
              data-testid="custom-workout-summary"
              className="mt-6 rounded-md border border-htk-red/25 bg-black/45 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.4)] md:p-6"
            >
              <WorkoutSummary
                goalTitle={`Custom ${builder.title}`}
                equipment={summaryEquipment}
                trainingModule={trainingModule}
                difficulty={summaryDifficulty}
                exercises={selectedExercises}
                stepLabel="Custom Summary"
                title="Custom Workout Summary"
                description={`This custom brief only uses selected exercises from ${builder.title}.`}
                coachingNotes={[
                  "Use the selected difficulty version for every movement.",
                  "Keep the session aligned to the module intent before adding volume."
                ]}
                safetyNotes={[
                  "If a movement does not fit the athlete today, modify the exercise or choose another module-relevant option."
                ]}
              />
            </div>
          ) : (
            <EmptyState
              label="Select exercises from the filtered library above to build a custom workout."
              hint="Use Add to Workout on exercise cards, then return here for the summary."
            />
          )}
        </div>
      </section>
    </section>
  );
}

function ChipGroup({
  title,
  testIdPrefix,
  options,
  value,
  onChange
}: {
  title: string;
  testIdPrefix: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string) => void;
}) {
  const description = filterDescription(title);

  return (
    <div>
      <div className="flex items-center gap-2">
        <p className="text-xs font-black uppercase text-htk-red">{title}</p>
        <Microcopy
          label="Guide"
          description={description}
          summaryClassName="px-2 py-1 text-[10px]"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            data-testid={`filter-${testIdPrefix}-${slugForTestId(option)}`}
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            title={`${title}: ${option}. ${description}`}
            aria-label={`Filter ${title} by ${option}`}
            className={cn(
              "rounded-md border px-3 py-2 text-xs font-black uppercase transition focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
              value === option
                ? "border-htk-red bg-htk-red text-white shadow-[0_10px_28px_rgba(225,29,46,0.22)]"
                : "border-white/10 bg-black/35 text-accent/70 hover:border-htk-red/60 hover:bg-htk-red/[0.08] hover:text-white"
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function filterDescription(title: string) {
  const descriptions: Record<string, string> = {
    "Muscle / Body Area": "Narrows the module to the body area or performance quality you want to train.",
    Equipment: "Shows exercises and presets that match what the athlete has available today.",
    Difficulty: "Controls complexity and intensity expectations for the exercise variations shown.",
    "Training Goal": "Filters by the primary adaptation or outcome the session is designed to support.",
    Duration: "Helps find work that fits the available time window without overloading the session.",
    "Movement Pattern": "Narrows the library by the dominant athletic pattern or drill family."
  };

  return descriptions[title] ?? "Use this filter to narrow the module library without leaving the page.";
}

function slugForTestId(value: string) {
  return value
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ActionPath({
  href,
  icon,
  title,
  copy,
  active,
  onActivate
}: {
  href: string;
  icon: ReactNode;
  title: string;
  copy: string;
  active: boolean;
  onActivate: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onActivate}
      aria-current={active ? "location" : undefined}
      title={copy}
      className={cn(
        "htk-path-card block focus:outline-none focus:ring-2 focus:ring-htk-red focus:ring-offset-2 focus:ring-offset-background",
        active && "border-htk-red/70 bg-htk-red/[0.09]"
      )}
    >
      <div className="text-htk-red">{icon}</div>
      <p className="mt-3 text-sm font-black uppercase text-accent">{title}</p>
      <p className="mt-2 text-sm leading-6 text-htk-muted">{copy}</p>
    </a>
  );
}

function EmptyState({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="htk-empty-state mt-5 p-5">
      <p className="text-sm font-black uppercase leading-6 text-accent">{label}</p>
      {hint ? <p className="mt-2 text-sm leading-6 text-htk-muted">{hint}</p> : null}
    </div>
  );
}

function durationBucket(minutes: number) {
  if (minutes < 15) return "Under 15";
  if (minutes <= 30) return "15-30";
  if (minutes <= 45) return "30-45";
  return "45+";
}
