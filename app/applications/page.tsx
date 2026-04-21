import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCoachingApplicationNotificationStatus } from "@/lib/coaching-application-notifications";
import {
  getCoachingApplicationStorageMode,
  getLocalCoachingApplicationsPath,
  listCoachingApplicationsWithSource
} from "@/lib/coaching-application-storage";

export const metadata: Metadata = {
  title: "Coaching Applications | HTK Training",
  description: "Review submitted HTK Training coaching applications."
};

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const result = await listCoachingApplicationsWithSource();
  const storageMode = getCoachingApplicationStorageMode();
  const notification = getCoachingApplicationNotificationStatus();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="container-px mx-auto flex h-[72px] max-w-7xl items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white">
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
          <span className="text-sm font-black uppercase text-red-400">Application Review</span>
        </div>
      </header>

      <section className="border-b border-white/10 py-14">
        <div className="container-px mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase text-red-400">Review queue</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Coaching assessment submissions
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/60">
            Storage mode: <span className="font-semibold text-white">{storageMode}</span>
          </p>
          <p className="mt-2 text-sm leading-7 text-white/48">
            Current source:{" "}
            <span className="font-semibold text-white">
              {result.source === "supabase" ? "Supabase" : "Local file"}
            </span>
            {result.fallback ? " (fallback active)" : ""}
          </p>
          {result.issue ? (
            <p className="mt-2 text-sm leading-7 text-red-300">
              Supabase issue: {result.issue}
            </p>
          ) : null}
          <p className="mt-2 text-sm leading-7 text-white/48">
            Email notifications:{" "}
            <span className="font-semibold text-white">
              {notification.configured ? "Configured" : "Not configured"}
            </span>
          </p>
          {result.source === "local_file" ? (
            <p className="mt-2 text-sm leading-7 text-white/48">
              Local file path: {getLocalCoachingApplicationsPath()}
            </p>
          ) : null}
        </div>
      </section>

      <section className="py-12">
        <div className="container-px mx-auto max-w-7xl">
          {result.applications.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="text-lg font-black text-white">No applications yet.</p>
              <p className="mt-3 text-sm leading-7 text-white/55">
                Once someone submits the assessment, responses will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {result.applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-lg border border-white/10 bg-[#090909] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-2xl font-black text-white">{application.name}</p>
                      <p className="mt-2 text-sm text-white/60">{application.email}</p>
                    </div>
                    <div className="text-sm text-white/48 sm:text-right">
                      <p>{new Date(application.createdAt).toLocaleString()}</p>
                      <p className="mt-1 uppercase tracking-wide">
                        {application.storage === "supabase" ? "Supabase" : "Local file"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <Answer
                      prompt="Primary fitness goal"
                      answer={application.primaryGoal}
                    />
                    <Answer
                      prompt="Current physical and mental state"
                      answer={application.currentState}
                    />
                    <Answer
                      prompt="Next phase target"
                      answer={application.nextPhaseGoal}
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Answer prompt="Time frame" answer={application.timeFrame} compact />
                      <Answer
                        prompt="Commitment level"
                        answer={application.commitmentLevel}
                        compact
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Answer({
  prompt,
  answer,
  compact = false
}: {
  prompt: string;
  answer: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-black uppercase text-red-400">{prompt}</p>
      <p className={`mt-3 text-sm leading-7 text-white/70 ${compact ? "font-semibold" : ""}`}>
        {answer}
      </p>
    </div>
  );
}
