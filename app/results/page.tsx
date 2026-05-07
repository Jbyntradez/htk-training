import Image from "next/image";
import type { Metadata } from "next";
import { CheckCircle2, Star, Video } from "lucide-react";
import { CtaLink } from "@/components/htk/CtaLink";
import { HtkBadge } from "@/components/htk/HtkBadge";
import { MobileStickyCta } from "@/components/htk/MobileStickyCta";
import { SectionIntro } from "@/components/htk/SectionIntro";
import { SiteFooter } from "@/components/htk/SiteFooter";
import { SiteHeader } from "@/components/htk/SiteHeader";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";
import { listApprovedPublicReviews } from "@/lib/review-storage";

export const metadata: Metadata = {
  title: "Results | HTK Training",
  description:
    "Approved HTK Training reviews, testimonials, and performance proof for athletes and high performers."
};

export const dynamic = "force-dynamic";

const whyHtkWorks = [
  "Disciplined progression instead of random programming",
  "Mobility, explosiveness, endurance, and durability trained together",
  "Coaching built for real physical capability, not fluff"
];

export default async function ResultsPage() {
  const reviews = await listApprovedPublicReviews();
  const featuredReviews = reviews.filter((review) => review.featured).slice(0, 2);
  const leadReviews = featuredReviews.length > 0 ? featuredReviews : reviews.slice(0, 2);
  const remainingReviews = reviews.filter((review) => !leadReviews.some((item) => item.id === review.id));
  const metricCards = [
    { label: "Approved proof", value: `${reviews.length}+` },
    {
      label: "Featured reviews",
      value: `${reviews.filter((review) => review.featured).length || leadReviews.length}`
    },
    {
      label: "Media-backed reviews",
      value: `${reviews.filter((review) => review.mediaUrl).length}`
    },
    {
      label: "Video-ready clients",
      value: `${reviews.filter((review) => review.wantsVideoTestimonial).length}`
    }
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <SiteHeader currentPath="/results" />
      <Hero />
      <Metrics metrics={metricCards} />
      <FeaturedReviews reviews={leadReviews} />
      <ReviewGrid reviews={remainingReviews.length > 0 ? remainingReviews : reviews} />
      <WhyHtkWorks />
      <FinalCta />
      <SiteFooter />
      <MobileStickyCta />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <Image
        src="/htk/train-for-real-life.png"
        alt="HTK Training proof of performance"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-center opacity-[0.26]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.82)_0%,rgba(5,5,5,0.64)_42%,rgba(5,5,5,0.96)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.88)_0%,rgba(5,5,5,0.42)_50%,rgba(5,5,5,0.88)_100%)]" />
      <div className="container-px mx-auto max-w-7xl py-20 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <HtkBadge>Approved proof</HtkBadge>
          <h1 className="mt-6 text-5xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl">
            Real results. Real athletes. <span className="text-red-500">Real work.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            These are approved HTK reviews from athletes and high performers documenting
            better output, cleaner movement, stronger conditioning, and more durable
            performance.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaLink href={HTK_BOOKING_URL} external className="w-full sm:w-auto">
              Book a Consultation
            </CtaLink>
            <CtaLink href={HTK_APPLICATION_PATH} variant="secondary" className="w-full sm:w-auto">
              Start Training
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics({
  metrics
}: {
  metrics: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="border-b border-white/10 bg-[#080808] py-14">
      <div className="container-px mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <p className="text-sm font-black uppercase tracking-wide text-red-400">
              {metric.label}
            </p>
            <p className="mt-4 text-4xl font-black text-white">{metric.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturedReviews({
  reviews
}: {
  reviews: Awaited<ReturnType<typeof listApprovedPublicReviews>>;
}) {
  return (
    <section className="border-b border-white/10 bg-[#050505] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Featured testimonials"
          title="High-visibility proof placed where the booking decision happens."
          body="Featured reviews sit closest to the CTA because they do the trust-building work fast."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d] shadow-[0_24px_90px_rgba(0,0,0,0.32)]"
            >
              {review.mediaUrl ? (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[#111]">
                  {review.mediaUrl.startsWith("/") ? (
                    <Image
                      src={review.mediaUrl}
                      alt={review.mediaLabel ?? review.displayName}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover grayscale-[10%]"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.mediaUrl}
                      alt={review.mediaLabel ?? review.displayName}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.82)_100%)]" />
                </div>
              ) : null}
              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-2xl font-black text-white">{review.displayName}</p>
                      <span className="rounded-md border border-red-500/35 bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-200">
                        Verified review
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-white/55">{review.athleteType}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/55">
                    {review.rating ? (
                      <span className="inline-flex items-center gap-2">
                        <Star className="size-4 text-red-400" />
                        {review.rating}/5
                      </span>
                    ) : null}
                    {review.wantsVideoTestimonial ? (
                      <span className="inline-flex items-center gap-2">
                        <Video className="size-4 text-red-400" />
                        Video-ready
                      </span>
                    ) : null}
                  </div>
                </div>
                <blockquote className="mt-6 text-2xl font-black leading-9 text-white">
                  {`"${review.testimonialQuote}"`}
                </blockquote>
                <p className="mt-5 text-sm leading-7 text-white/64">{review.resultImprovement}</p>
                <div className="mt-6 flex flex-wrap gap-2">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewGrid({
  reviews
}: {
  reviews: Awaited<ReturnType<typeof listApprovedPublicReviews>>;
}) {
  return (
    <section className="border-b border-white/10 bg-[#080808] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Approved reviews"
            title="Every approved review supports the same decision."
            body="This page is built to make the next step feel obvious: if the coaching is working for people like this, book the conversation and see if it fits."
            align="left"
          />
          <CtaLink href={HTK_BOOKING_URL} external>
            Book a Consultation
          </CtaLink>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xl font-black text-white">{review.displayName}</p>
                {review.featured ? (
                  <span className="rounded-md border border-red-500/35 bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-200">
                    Featured
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-white/50">{review.athleteType}</p>
              <p className="mt-6 text-lg font-black leading-8 text-white">
                {`"${review.testimonialQuote}"`}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/62">{review.resultImprovement}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {review.resultTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/10 bg-[#050505] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white/64"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyHtkWorks() {
  return (
    <section className="border-b border-white/10 bg-[#050505] py-20 md:py-24">
      <div className="container-px mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <SectionIntro
          eyebrow="Why HTK works"
          title="The results come from coaching that is built like a system."
          body="HTK blends performance, durability, mobility, and disciplined progression into one standard. That is why the proof feels consistent."
          align="left"
        />
        <div className="grid gap-4">
          {whyHtkWorks.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-5"
            >
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-red-400" />
              <p className="text-sm leading-7 text-white/68">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#050505] py-20 md:py-28">
      <Image
        src="/htk/gym-operator.jpg"
        alt="HTK Training CTA"
        fill
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-top opacity-[0.18] grayscale-[10%]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.86)_0%,rgba(5,5,5,0.72)_46%,rgba(5,5,5,0.96)_100%)]" />
      <div className="container-px mx-auto max-w-5xl text-center">
        <HtkBadge>Turn proof into action</HtkBadge>
        <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
          If the results feel real, book the conversation.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
          Training with intent starts with clarity. Book a consultation and find out what
          the right next phase looks like.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaLink href={HTK_BOOKING_URL} external className="w-full sm:w-auto">
            Book a Consultation
          </CtaLink>
          <CtaLink href={HTK_APPLICATION_PATH} variant="secondary" className="w-full sm:w-auto">
            Apply for Coaching
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
