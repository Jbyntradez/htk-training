import Image from "next/image";
import type { Metadata } from "next";
import { Camera, CheckCircle2, ShieldCheck } from "lucide-react";
import { ReviewSubmissionForm } from "@/components/ReviewSubmissionForm";
import { SiteFooter } from "@/components/htk/SiteFooter";
import { SiteHeader } from "@/components/htk/SiteHeader";
import { MobileStickyCta } from "@/components/htk/MobileStickyCta";
import { HtkBadge } from "@/components/htk/HtkBadge";

export const metadata: Metadata = {
  title: "Submit a Review | HTK Training",
  description:
    "Submit an official HTK Training review or testimonial for internal review and possible public display."
};

const reviewStandards = [
  {
    title: "Clear proof",
    body: "Structured feedback that can actually become usable social proof.",
    icon: CheckCircle2
  },
  {
    title: "Public permission control",
    body: "You decide whether HTK can display the review publicly or keep it private.",
    icon: ShieldCheck
  },
  {
    title: "Media-ready intake",
    body: "Optional screenshot or image upload so written proof can turn into stronger assets.",
    icon: Camera
  }
];

export default function SubmitReviewPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <SiteHeader currentPath="/submit-review" />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/htk/gym-operator.jpg"
          alt="HTK review submission"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-top opacity-[0.16] grayscale-[18%]"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.72)_0%,rgba(5,5,5,0.9)_100%)]" />
        <div className="container-px mx-auto max-w-7xl py-16 md:py-20">
          <div className="max-w-3xl">
            <HtkBadge>Client proof intake</HtkBadge>
            <h1 className="mt-5 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              Submit a review that reflects real work.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/64">
              This is an official HTK review submission page built for serious feedback,
              not casual comments. Your response can help HTK document real outcomes and
              publish legitimate proof with the right permissions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-px mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ReviewSubmissionForm />

          <aside className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#090909]">
              <div className="relative aspect-[4/5] border-b border-white/10">
                <Image
                  src="/htk/train-for-real-life.png"
                  alt="HTK Training review standards"
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.85)_100%)]" />
                <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/10 bg-black/55 px-4 py-3 text-sm font-black uppercase text-white/80 backdrop-blur">
                  Reviews are screened before they become public proof.
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="text-sm font-black uppercase text-red-400">What happens next</p>
              <div className="mt-5 space-y-4">
                <Step number="01" body="Your submission is stored, reviewed, and organized in the internal review queue." />
                <Step number="02" body="HTK decides whether the review stays internal, gets published, or gets featured." />
                <Step number="03" body="If you checked the video box, HTK knows you are open to a stronger testimonial asset." />
              </div>
            </div>

            <div className="grid gap-4">
              {reviewStandards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
                  >
                    <div className="mb-5 grid size-11 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-400">
                      <Icon className="size-5" />
                    </div>
                    <h2 className="text-lg font-black text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/60">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
      <MobileStickyCta />
    </main>
  );
}

function Step({ number, body }: { number: string; body: string }) {
  return (
    <div className="flex gap-3 rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
      <span className="text-sm font-black text-red-400">{number}</span>
      <p className="text-sm leading-6 text-white/68">{body}</p>
    </div>
  );
}
