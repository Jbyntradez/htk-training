import type { ExerciseModification } from "@/lib/content";

const levels: Array<keyof ExerciseModification> = ["beginner", "intermediate", "advanced"];

export function ModificationDisplay({ modifications }: { modifications: ExerciseModification }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {levels.map((level) => (
        <div key={level} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-black uppercase text-accent/45">{level}</p>
          <p className="mt-2 text-sm leading-6 text-accent/70">{modifications[level]}</p>
        </div>
      ))}
    </div>
  );
}
