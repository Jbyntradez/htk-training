import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Video } from "lucide-react";
import { CopyReviewButton } from "@/components/reviews/CopyReviewButton";
import { ReviewAdminControls } from "@/components/reviews/ReviewAdminControls";
import { ReviewStatusPill } from "@/components/reviews/ReviewStatusPill";
import { getReviewSubmission } from "@/lib/review-storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const review = await getReviewSubmission(id);

  return {
    title: review ? `${review.displayName} | Review Management | HTK Training` : "Review Management | HTK Training"
  };
}

export default async function ReviewDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const review = await getReviewSubmission(id);

  if (!review) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="container-px mx-auto flex h-[72px] max-w-7xl items-center justify-between py-4">
          <Link
            href="/reviews/manage"
            className="flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to queue
          </Link>
          <span className="text-sm font-black uppercase text-red-400">Review detail</span>
        </div>
      </header>

      <section className="border-b border-white/10 py-14">
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-4xl font-black text-white">{review.displayName}</p>
                <ReviewStatusPill status={review.status} />
                {review.featured ? (
                  <span className="inline-flex items-center rounded-md border border-red-500/35 bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-200">
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="mt-4 text-base leading-8 text-white/60">
                {review.fullName} • {review.athleteType}
              </p>
            </div>
            <div className="text-sm text-white/48 lg:text-right">
              <p>{new Date(review.createdAt).toLocaleString()}</p>
              <p className="mt-1 uppercase tracking-wide">{review.storage}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-px mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="space-y-6">
            <article className="rounded-lg border border-white/10 bg-[#090909] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
              <p className="text-sm font-black uppercase text-red-400">Public preview</p>
              <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.035] p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-black text-white">{review.displayName}</p>
                    <p className="mt-2 text-sm text-white/55">{review.athleteType}</p>
                  </div>
                  <div className="flex gap-2">
                    {review.resultTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/10 bg-[#050505] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white/64"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-6 text-2xl font-black leading-9 text-white">
                  {`"${review.testimonialQuote}"`}
                </p>
                <p className="mt-5 text-sm leading-7 text-white/64">{review.resultImprovement}</p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <CopyReviewButton
                  content={`${review.displayName}\n${review.athleteType}\n\n${review.testimonialQuote}\n\n${review.resultImprovement}`}
                />
                {review.mediaUrl ? (
                  <a
                    href={review.mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-4 text-sm font-black text-white transition hover:border-red-500/45 hover:bg-red-500/[0.06]"
                  >
                    Open Uploaded Media
                  </a>
                ) : null}
              </div>
            </article>

            <article className="rounded-lg border border-white/10 bg-[#090909] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
              <p className="text-sm font-black uppercase text-red-400">Submission detail</p>
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                <Answer prompt="Full name" answer={review.fullName} />
                <Answer prompt="Display name" answer={review.displayName} />
                <Answer prompt="Email" answer={review.email} />
                <Answer prompt="How they trained with HTK" answer={review.trainingWithHtk} />
                <Answer prompt="Biggest challenge before HTK" answer={review.challengeBefore} />
                <Answer prompt="Result or improvement" answer={review.resultImprovement} />
                <Answer prompt="Testimonial quote" answer={review.testimonialQuote} />
                <Answer
                  prompt="Rating"
                  answer={review.rating ? `${review.rating} / 5` : "No rating submitted"}
                />
              </div>
            </article>

            {review.mediaUrl ? (
              <article className="overflow-hidden rounded-lg border border-white/10 bg-[#090909] shadow-[0_24px_90px_rgba(0,0,0,0.24)]">
                <div className="relative aspect-[4/3] border-b border-white/10 bg-[#111]">
                  {review.mediaUrl.startsWith("/") ? (
                    <Image
                      src={review.mediaUrl}
                      alt={review.mediaLabel ?? "Uploaded review media"}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.mediaUrl}
                      alt={review.mediaLabel ?? "Uploaded review media"}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-red-400">
                    Uploaded proof
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/64">
                    {review.mediaLabel ?? "Client-uploaded screenshot or image"}
                  </p>
                </div>
              </article>
            ) : null}
          </div>

          <aside className="space-y-6">
            <ReviewAdminControls review={review} />

            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="text-sm font-black uppercase text-red-400">Contact signals</p>
              <div className="mt-5 space-y-4">
                <Signal
                  icon={<Mail className="size-4 text-red-400" />}
                  label="Email"
                  body={review.email || "No email recorded"}
                />
                <Signal
                  icon={<Video className="size-4 text-red-400" />}
                  label="Video testimonial"
                  body={
                    review.wantsVideoTestimonial
                      ? "Open to being contacted for a video testimonial."
                      : "No video testimonial consent checked."
                  }
                />
                <Signal
                  icon={<ReviewStatusPill status={review.status} />}
                  label="Public permission"
                  body={
                    review.publicPermission
                      ? "Permission is on. Review can be published if approved."
                      : "Permission is off. Keep private unless updated."
                  }
                />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Answer({ prompt, answer }: { prompt: string; answer: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-black uppercase text-red-400">{prompt}</p>
      <p className="mt-3 text-sm leading-7 text-white/70">{answer}</p>
    </div>
  );
}

function Signal({
  icon,
  label,
  body
}: {
  icon: ReactNode;
  label: string;
  body: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
      <div className="mt-1 shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-black text-white">{label}</p>
        <p className="mt-2 text-sm leading-6 text-white/64">{body}</p>
      </div>
    </div>
  );
}
