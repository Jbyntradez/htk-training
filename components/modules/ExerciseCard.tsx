import { ChevronDown, ListChecks, ShieldCheck, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/content";
import { ModificationDisplay } from "@/components/modules/ModificationDisplay";
import { VideoPlaceholder } from "@/components/modules/VideoPlaceholder";

function BulletList({ items, tone = "default" }: { items: string[]; tone?: "default" | "warning" | "safe" }) {
  return (
    <ul className="mt-3 grid gap-2 text-sm leading-6 text-accent/65">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span
            className={cn(
              "mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/35",
              tone === "warning" && "bg-red-300/75",
              tone === "safe" && "bg-emerald-300/75"
            )}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <article id={exercise.id} className="rounded-md border border-white/10 bg-primary p-5 shadow-premium">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Badge>Exercise</Badge>
          <h3 className="mt-3 text-2xl font-black">{exercise.name}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-accent/65">{exercise.explanation}</p>
        </div>
        <div className="rounded-md border border-white/10 bg-background px-4 py-3 text-sm font-black text-accent">
          {exercise.recommended}
        </div>
      </div>

      <div className="mt-5">
        <VideoPlaceholder title={exercise.name} videoUrl={exercise.videoUrl} />
      </div>

      <details className="group mt-5 rounded-md border border-white/10 bg-background">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-black uppercase text-accent/80">
          Detailed coaching notes
          <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
        </summary>
        <div className="grid gap-5 border-t border-white/10 p-4">
          <section>
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-accent/55" />
              <h4 className="font-black">Coaching cues</h4>
            </div>
            <BulletList items={exercise.coachingCues} tone="safe" />
          </section>

          <section>
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4 text-red-300/75" />
              <h4 className="font-black">Common mistakes</h4>
            </div>
            <BulletList items={exercise.commonMistakes} tone="warning" />
          </section>

          <section>
            <h4 className="font-black">Beginner / Intermediate / Advanced</h4>
            <div className="mt-3">
              <ModificationDisplay modifications={exercise.modifications} />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent/55" />
                <h4 className="font-black">Safety notes</h4>
              </div>
              <BulletList items={exercise.safetyNotes} />
            </div>
            <div>
              <h4 className="font-black">Progression notes</h4>
              <BulletList items={exercise.progressionNotes} />
            </div>
          </section>
        </div>
      </details>
    </article>
  );
}
