import Image from "next/image";
import type { Metadata } from "next";
import { ShieldCheck, Timer, Zap } from "lucide-react";
import { CoachingApplicationForm } from "@/components/CoachingApplicationForm";
import { CtaLink } from "@/components/htk/CtaLink";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HTK_BOOKING_URL } from "@/lib/htk-config";

export const metadata: Metadata = {
  title: "Apply for Coaching | HTK Training",
  description:
    "Apply for HTK Training coaching with a short performance assessment."
};

const standards = [
  {
    title: "Explosive output",
    body: "Training built to sharpen force, speed, and repeat effort.",
    icon: Zap
  },
  {
    title: "Structured progression",
    body: "Clear phases, clear standards, and no wasted work.",
    icon: Timer
  },
  {
    title: "Real-world resilience",
    body: "Performance that holds together outside perfect conditions.",
    icon: ShieldCheck
  }
];

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <MarketingNav activeHref="/apply" />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/htk/htk-training-01.jpg"
          alt="HTK Training athlete"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover object-top opacity-[0.2] grayscale-[18%]"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.74)_0%,rgba(5,5,5,0.9)_100%)]" />
        <div className="container-px mx-auto max-w-7xl py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-red-400">HTK coaching intake</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              Apply for coaching with intent.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/64">
              This is a short performance assessment for athletes and disciplined
              individuals who want real structure, real pressure, and real results.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-px mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <CoachingApplicationForm />

          <aside className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#090909]">
              <div className="relative aspect-[4/5] border-b border-white/10">
                <Image
                  src="/htk/nmu-football.jpg"
                  alt="HTK Training athlete at Northern Michigan"
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.1)_0%,rgba(5,5,5,0.85)_100%)]" />
                <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/10 bg-black/55 px-4 py-3 text-sm font-black uppercase text-white/80 backdrop-blur">
                  Coaching is built for output, resilience, and athletic carryover.
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <p className="text-sm font-black uppercase text-red-400">What happens next</p>
              <div className="mt-5 space-y-4">
                <Step number="01" body="Your assessment is reviewed for fit, goals, and commitment." />
                <Step number="02" body="If coaching makes sense, I will reach out with the next move." />
                <Step number="03" body="If you want to talk first, you can book a consultation right now." />
              </div>
              <CtaLink href={HTK_BOOKING_URL} external variant="secondary" className="mt-6 w-full">
                Book a Consultation
              </CtaLink>
            </div>

            <div className="grid gap-4">
              {standards.map((item) => {
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
