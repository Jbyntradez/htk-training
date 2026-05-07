import Image from "next/image";
import type { Metadata } from "next";
import { ShieldCheck, TimerReset, Zap } from "lucide-react";
import { CtaLink } from "@/components/htk/CtaLink";
import { HtkBadge } from "@/components/htk/HtkBadge";
import { MobileStickyCta } from "@/components/htk/MobileStickyCta";
import { SectionIntro } from "@/components/htk/SectionIntro";
import { SiteFooter } from "@/components/htk/SiteFooter";
import { SiteHeader } from "@/components/htk/SiteHeader";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";
import { listApprovedPublicReviews } from "@/lib/review-storage";

export const metadata: Metadata = {
  title: "HTK Training | Hard to Kill Training",
  description:
    "Elite performance coaching for athletes and high performers building explosiveness, endurance, mobility, durability, and serious physical capability."
};

export const dynamic = "force-dynamic";

const pillars = [
  {
    title: "Explosive",
    body: "Power that carries into the field, the gym, and real pressure.",
    icon: Zap
  },
  {
    title: "Enduring",
    body: "Conditioning that supports performance without making the body feel flat.",
    icon: TimerReset
  },
  {
    title: "Durable",
    body: "Mobility, structure, and progression that hold up under hard work.",
    icon: ShieldCheck
  }
];

const servicePreview = [
  {
    title: "Consultation",
    body: "Direct clarity on your current level, your next phase, and the right move forward.",
    cta: "Book a Consultation",
    href: HTK_BOOKING_URL,
    external: true,
    image: "/htk/hero-field-athlete.jpg"
  },
  {
    title: "Coaching Application",
    body: "Structured intake for athletes and high performers ready for serious coaching.",
    cta: "Apply for Coaching",
    href: HTK_APPLICATION_PATH,
    external: false,
    image: "/htk/gym-operator.jpg"
  }
];

export default async function HomePage() {
  const reviews = await listApprovedPublicReviews();
  const previewReviews = reviews.slice(0, 3);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <SiteHeader currentPath="/" />
      <Hero />
      <ValueProp />
      <ServiceOverview />
      <ProofPreview reviews={previewReviews} />
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
        src="/htk/hero-field-athlete.jpg"
        alt="HTK Training athlete on a football field"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-[50%_24%] opacity-[0.34] grayscale-[14%]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.82)_0%,rgba(5,5,5,0.68)_44%,rgba(5,5,5,0.96)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.84)_0%,rgba(5,5,5,0.38)_50%,rgba(5,5,5,0.84)_100%)]" />
      <div className="container-px mx-auto max-w-7xl py-20 sm:py-24 lg:py-28">
        <div className="max-w-4xl">
          <HtkBadge>Coaching and consultations</HtkBadge>
          <h1 className="mt-6 text-5xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl">
            Build a body that is <span className="text-red-500">hard to kill.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
            HTK Training is performance coaching for athletes and disciplined high
            performers who want explosiveness, endurance, mobility, durability, and a
            sharper standard of physical capability.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={HTK_BOOKING_URL} external className="w-full sm:w-auto">
              Book a Consultation
            </CtaLink>
            <CtaLink href="/results" variant="secondary" className="w-full sm:w-auto">
              View Results
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueProp() {
  return (
    <section className="border-b border-white/10 bg-[#070707] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="HTK standard"
          title="Clean message. Serious coaching. Better physical output."
          body="The homepage stays focused. The mission is simple: show what HTK does, prove it works, and move qualified people toward a consultation or coaching application."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-6 transition hover:border-red-500/45 hover:bg-red-500/[0.05]"
              >
                <div className="mb-8 grid size-12 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-400">
                  <Icon className="size-5" />
                </div>
                <h2 className="text-xl font-black text-white">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/62">{pillar.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceOverview() {
  return (
    <section className="border-b border-white/10 bg-[#050505] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <SectionIntro
            eyebrow="Start here"
            title="Two clear paths. Less clutter. Better navigation."
            body="Use the consultation when you want a direct read on your next move. Use the application when you are ready for a more committed coaching conversation."
            align="left"
          >
            <div className="mt-8">
              <CtaLink href="/results" variant="secondary">
                See More Proof
              </CtaLink>
            </div>
          </SectionIntro>
          <div className="grid gap-5 lg:grid-cols-2">
            {servicePreview.map((item) => (
              <article
                key={item.title}
                className="group overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d] shadow-[0_24px_90px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:border-red-500/45"
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover grayscale-[14%] transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.76)_100%)]" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/62">{item.body}</p>
                  <CtaLink
                    href={item.href}
                    external={item.external}
                    size="card"
                    className="mt-6"
                  >
                    {item.cta}
                  </CtaLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofPreview({
  reviews
}: {
  reviews: Awaited<ReturnType<typeof listApprovedPublicReviews>>;
}) {
  return (
    <section className="border-b border-white/10 bg-[#080808] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow="Proof"
            title="Enough social proof to build trust without cramming the homepage."
            body="The full proof lives on the dedicated results page. This section only previews the standard and gives the next click somewhere intentional to go."
            align="left"
          />
          <CtaLink href="/results" variant="secondary">
            Explore All Results
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
                <span className="rounded-md border border-red-500/35 bg-red-500/[0.08] px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-red-200">
                  Verified review
                </span>
              </div>
              <p className="mt-2 text-sm text-white/50">{review.athleteType}</p>
              <p className="mt-6 text-lg font-black leading-8 text-white">
                {`"${review.testimonialQuote}"`}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {review.resultTags.slice(0, 3).map((tag) => (
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

function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#050505] py-20 md:py-28">
      <Image
        src="/htk/train-for-real-life.png"
        alt="HTK Training final CTA"
        fill
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover opacity-[0.22] grayscale-[12%]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.84)_0%,rgba(5,5,5,0.7)_44%,rgba(5,5,5,0.96)_100%)]" />
      <div className="container-px mx-auto max-w-5xl text-center">
        <HtkBadge>Take the next step</HtkBadge>
        <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
          Book the call. Get clear. Start training with intent.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
          HTK is built for people who want structure, proof, and a body that performs when
          it counts.
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
