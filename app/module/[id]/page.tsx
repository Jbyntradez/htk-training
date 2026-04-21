import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { CompleteButton } from "@/components/dashboard/CompleteButton";
import { modules } from "@/lib/content";
import { getAccessState } from "@/lib/access";

export default async function ModuleLessonPage({ params }: { params: { id: string } }) {
  const lesson = modules.find((module) => module.id === params.id);

  if (!lesson) {
    notFound();
  }

  const { completedLessons } = await getAccessState();

  return (
    <DashboardShell>
      <article>
        <p className="text-sm font-black uppercase text-accent/45">{lesson.duration}</p>
        <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight sm:text-6xl">{lesson.title}</h1>
            <p className="mt-4 max-w-2xl text-accent/60">{lesson.deck}</p>
          </div>
          <CompleteButton moduleId={lesson.id} completed={completedLessons.includes(lesson.id)} />
        </div>
        <div className="mt-10 aspect-video overflow-hidden rounded-md border border-white/10 bg-primary">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        <div className="mt-10 grid gap-5 text-lg leading-8 text-accent/70">
          {lesson.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </DashboardShell>
  );
}
