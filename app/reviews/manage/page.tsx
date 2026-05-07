import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ImageIcon, Star } from "lucide-react";
import { CopyReviewButton } from "@/components/reviews/CopyReviewButton";
import { ReviewStatusPill } from "@/components/reviews/ReviewStatusPill";
import {
  getLocalReviewSubmissionsPath,
  getReviewSubmissionStorageMode,
  listReviewSubmissions
} from "@/lib/review-storage";

export const metadata: Metadata = {
  title: "Review Management | HTK Training",
  description: "Internal review queue for HTK testimonial submissions."
};

export const dynamic = "force-dynamic";

export default async function ReviewManagementPage({
  searchParams
}: {
  searchParams?: Promise<{
    status?: string;
    q?: string;
  }>;
}) {
  const params = (await searchParams) ?? {};
  const result = await listReviewSubmissions();
  const storageMode = getReviewSubmissionStorageMode();
  const query = params.q?.trim().toLowerCase() ?? "";
  const filtered = result.reviews.filter((review) => {
    const matchesStatus = !params.status || params.status === "all" || review.status === params.status;
    const matchesQuery =
      !query ||
      review.fullName.toLowerCase().includes(query) ||
      review.displayName.toLowerCase().includes(query) ||
      review.athleteType.toLowerCase().includes(query) ||
      review.testimonialQuote.toLowerCase().includes(query);

    return matchesStatus && matchesQuery;
  });

  const counts = {
    all: result.reviews.length,
    pending: result.reviews.filter((review) => review.status === "pending").length,
    approved: result.reviews.filter((review) => review.status === "approved").length,
    rejected: result.reviews.filter((review) => review.status === "rejected").length
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="container-px mx-auto flex h-[72px] max-w-7xl items-center justify-between py-4">
          <Link
            href="/results"
            className="flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to site
          </Link>
          <span className="text-sm font-black uppercase text-red-400">Review management</span>
        </div>
      </header>

      <section className="border-b border-white/10 py-14">
        <div className="container-px mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase text-red-400">Internal queue</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            Review submissions
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
            <p className="mt-2 text-sm leading-7 text-red-300">Storage issue: {result.issue}</p>
          ) : null}
          {result.source === "local_file" ? (
            <p className="mt-2 text-sm leading-7 text-white/48">
              Local file path: {getLocalReviewSubmissionsPath()}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "All", value: "all", count: counts.all },
              { label: "Pending", value: "pending", count: counts.pending },
              { label: "Approved", value: "approved", count: counts.approved },
              { label: "Rejected", value: "rejected", count: counts.rejected }
            ].map((filter) => {
              const active = (params.status ?? "all") === filter.value;

              return (
                <Link
                  key={filter.value}
                  href={`/reviews/manage?status=${filter.value}`}
                  className={`inline-flex min-h-11 items-center rounded-md border px-4 text-sm font-black transition ${
                    active
                      ? "border-red-500/45 bg-red-500/[0.08] text-white"
                      : "border-white/10 bg-white/[0.04] text-white/68 hover:border-red-500/35 hover:text-white"
                  }`}
                >
                  {filter.label} <span className="ml-2 text-white/45">{filter.count}</span>
                </Link>
              );
            })}
          </div>

          <form className="mt-5 flex flex-col gap-3 sm:flex-row" action="/reviews/manage">
            <input
              type="hidden"
              name="status"
              value={params.status && params.status !== "all" ? params.status : "all"}
            />
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search name, athlete type, or quote"
              className="h-11 w-full rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/32 focus:border-red-500/45 sm:max-w-md"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-black text-white shadow-[0_0_36px_rgba(220,38,38,0.24)] transition hover:bg-red-400"
              >
                Search
              </button>
              {params.q ? (
                <Link
                  href={params.status && params.status !== "all" ? `/reviews/manage?status=${params.status}` : "/reviews/manage"}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-black text-white/72 transition hover:border-red-500/35 hover:text-white"
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="py-12">
        <div className="container-px mx-auto max-w-7xl">
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="text-lg font-black text-white">No reviews in this filter.</p>
              <p className="mt-3 text-sm leading-7 text-white/55">
                As reviews are submitted, they will appear here with approval controls and
                detail views.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((review) => (
                <article
                  key={review.id}
                  className="rounded-lg border border-white/10 bg-[#090909] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)]"
                >
                  <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-2xl font-black text-white">{review.displayName}</p>
                        <ReviewStatusPill status={review.status} />
                        {review.featured ? (
                          <span className="inline-flex items-center rounded-md border border-red-500/35 bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-200">
                            Featured
                          </span>
                        ) : null}
                        {review.publicPermission ? (
                          <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white/68">
                            Public OK
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm text-white/60">
                        {review.fullName} • {review.athleteType}
                      </p>
                    </div>
                    <div className="text-sm text-white/48 lg:text-right">
                      <p>{new Date(review.createdAt).toLocaleString()}</p>
                      <p className="mt-1 uppercase tracking-wide">{review.storage}</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="text-xs font-black uppercase text-red-400">Testimonial quote</p>
                      <p className="mt-3 text-lg font-black leading-8 text-white">
                        {`"${review.testimonialQuote}"`}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-white/60">
                        {review.resultImprovement}
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                        <p className="text-xs font-black uppercase text-red-400">Signals</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {review.resultTags.length > 0
                            ? review.resultTags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md border border-white/10 bg-[#050505] px-3 py-1 text-xs font-black uppercase text-white/64"
                                >
                                  {tag}
                                </span>
                              ))
                            : null}
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/58">
                          <span className="inline-flex items-center gap-2">
                            <Star className="size-4 text-red-400" />
                            {review.rating ? `${review.rating}/5` : "No rating"}
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <ImageIcon className="size-4 text-red-400" />
                            {review.mediaUrl ? "Media uploaded" : "No media"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/reviews/manage/${review.id}`}
                          className="inline-flex min-h-11 items-center justify-center rounded-md bg-red-500 px-4 text-sm font-black text-white shadow-[0_0_36px_rgba(220,38,38,0.28)] transition hover:bg-red-400"
                        >
                          Open Review
                          <ArrowUpRight className="ml-2 size-4" />
                        </Link>
                        <CopyReviewButton
                          content={`${review.displayName}\n${review.athleteType}\n\n${review.testimonialQuote}\n\n${review.resultImprovement}`}
                        />
                      </div>
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
