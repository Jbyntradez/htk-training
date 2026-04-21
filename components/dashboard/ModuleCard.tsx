import { Lock, PlayCircle, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { Module } from "@/lib/content";

export function ModuleCard({
  module,
  unlocked,
  completed
}: {
  module: Module;
  unlocked: boolean;
  completed: boolean;
}) {
  return (
    <article className="rounded-md border border-white/10 bg-primary p-5 shadow-premium transition hover:-translate-y-1 hover:border-white/20 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-accent/45">{module.duration}</p>
          <h3 className="mt-3 text-2xl font-black">{module.title}</h3>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-background">
          {completed ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : unlocked ? <PlayCircle className="h-5 w-5 shrink-0" /> : <Lock className="h-5 w-5 shrink-0" />}
        </div>
      </div>
      <p className="mt-4 min-h-16 text-sm leading-6 text-accent/60">{module.deck}</p>
      <ButtonLink href={unlocked ? `/module/${module.id}` : "/checkout"} variant={unlocked ? "solid" : "outline"} className="mt-6 w-full">
        {unlocked ? "Open Lesson" : "Unlock"}
      </ButtonLink>
    </article>
  );
}
