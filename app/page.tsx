import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  BadgeCheck,
  Dumbbell,
  Instagram,
  Mail,
  ShieldCheck,
  Target,
  Timer,
  Youtube,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CtaLink } from "@/components/htk/CtaLink";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";

const trustIndicators = [
  "Multi-sport athlete",
  "Northern Michigan football",
  "Marine Corps background",
  "Performance specialization"
];

const pillars: Array<{ title: string; body: string; icon: LucideIcon }> = [
  {
    title: "Explosive",
    body: "Power you can express on the field, in the gym, and under pressure.",
    icon: Zap
  },
  {
    title: "Mobile",
    body: "Strong positions, clean movement, and the range to stay dangerous.",
    icon: Activity
  },
  {
    title: "Enduring",
    body: "An engine that holds up after the easy work is gone.",
    icon: Timer
  },
  {
    title: "Resilient",
    body: "Training that builds armor without sacrificing speed or athleticism.",
    icon: ShieldCheck
  }
];

const audiences = [
  "Athletes who need speed, strength, and repeat power",
  "Former athletes who want their edge back",
  "Military-minded men and women who train with intent",
  "High performers who need structure and standards",
  "Disciplined beginners ready to outgrow random workouts",
  "Anyone tired of soft fitness and empty motivation"
];

const services = [
  {
    title: "Performance Consultation",
    body: "A direct assessment of your goals, training history, constraints, and next move.",
    cta: "Book Consultation",
    href: HTK_BOOKING_URL,
    external: true,
    image: "/htk/htk-training-01.jpg",
    meta: "Best first step"
  },
  {
    title: "1:1 Coaching",
    body: "Custom programming, execution standards, progression, and accountability.",
    cta: "Apply for Coaching",
    href: HTK_APPLICATION_PATH,
    external: false,
    image: "/htk/field-throw.jpg",
    meta: "Highest touchpoint"
  },
  {
    title: "Performance Strategy Call",
    body: "Dial in explosiveness, mobility, endurance, and training direction.",
    cta: "Schedule Call",
    href: HTK_BOOKING_URL,
    external: true,
    image: "/htk/mirror-conditioning.jpg",
    meta: "Focused consult"
  }
];

const differences = [
  "Not random bodybuilding with a tactical name.",
  "Not endless conditioning that breaks down movement.",
  "Not influencer fluff, recycled templates, or hype training.",
  "Built around output, movement quality, durability, and discipline."
];

const processSteps = [
  {
    title: "Assess",
    body: "Identify your current engine, movement limits, power gaps, and real constraints."
  },
  {
    title: "Build",
    body: "Create the plan around strength, speed, mobility, conditioning, and recovery."
  },
  {
    title: "Execute",
    body: "Train with clear standards, tracked progress, and work that transfers."
  },
  {
    title: "Upgrade",
    body: "Adjust the system as your body adapts and your capacity rises."
  }
];

const results = [
  "More explosive first step and repeat sprint ability",
  "Better endurance without losing athletic power",
  "Cleaner mobility, stronger positions, and fewer leaks",
  "A body that carries muscle, speed, and work capacity",
  "Training confidence under fatigue and pressure",
  "A sharper standard for discipline outside the gym"
];

const testimonials = [
  {
    name: "Jordan M.",
    role: "Collegiate athlete",
    quote: "I move better, recover faster, and perform at a different level now."
  },
  {
    name: "Marcus R.",
    role: "Tactical athlete",
    quote: "This is not gym training. This is real performance."
  },
  {
    name: "Alina S.",
    role: "Former sprinter",
    quote: "My endurance and explosiveness completely changed."
  }
];

const socials = [
  {
    label: "YouTube",
    href: "https://youtube.com/@jimmyHTK",
    icon: Youtube
  },
  {
    label: "Instagram",
    href: "https://instagram.com/",
    icon: Instagram
  },
  {
    label: "X",
    href: "https://x.com/bynum369963",
    textIcon: "X"
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/",
    textIcon: "TT"
  },
  {
    label: "Email",
    href: "mailto:bynumj634@gmail.com",
    icon: Mail
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <Header />
      <Hero />
      <Philosophy />
      <Audience />
      <Services />
      <WhyHtk />
      <About />
      <Process />
      <Results />
      <Testimonials />
      <Socials />
      <FinalCta />
      <Footer />
      <MobileCta />
    </main>
  );
}

function Header() {
  return <MarketingNav activeHref="/" />;
}

function Hero() {
  return (
    <section id="home" className="relative isolate border-b border-white/10">
      <Image
        src="/htk/hero-field-athlete.jpg"
        alt="HTK Training athlete on a football field"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover object-[50%_30%] opacity-[0.46] grayscale-[18%]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.76)_0%,rgba(5,5,5,0.65)_38%,rgba(5,5,5,0.92)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.25)_50%,rgba(5,5,5,0.78)_100%)]" />
      <div className="container-px mx-auto flex min-h-[calc(100svh-6rem)] max-w-7xl flex-col items-center justify-center py-16 text-center sm:py-20">
        <Badge>Coaching and consultation intake open</Badge>
        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-8xl">
          Build a Body That Is <span className="text-red-500">Hard to Kill.</span>
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
          Explosive, mobile, enduring, resilient, and efficient. HTK Training builds
          real-world physical dominance for athletes, high performers, and disciplined
          individuals who refuse soft standards.
        </p>
        <div className="mt-9 flex w-full max-w-xl flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaLink href={HTK_BOOKING_URL} external className="w-full sm:w-auto">
            Book a Consultation
          </CtaLink>
          <CtaLink href={HTK_APPLICATION_PATH} variant="secondary" className="w-full sm:w-auto">
            Apply for Coaching
          </CtaLink>
        </div>
        <div className="mt-10 grid w-full max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
          {trustIndicators.map((indicator) => (
            <div
              key={indicator}
              className="rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-xs font-bold uppercase text-white/70 backdrop-blur"
            >
              {indicator}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  return (
    <section className="border-b border-white/10 bg-[#070707] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="What HTK Training is"
          title="A disciplined performance system for bodies that have to work."
          body="HTK is not about looking athletic for one photo. It is about becoming explosive, mobile, enduring, resilient, and capable when conditions are not perfect."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <FeatureCard key={pillar.title} icon={pillar.icon} title={pillar.title}>
              {pillar.body}
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section className="border-b border-white/10 bg-[#050505] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionIntro
            align="left"
            eyebrow="Who this is for"
            title="Built for people who train like their body has a job."
            body="If you want performance that transfers beyond mirrors, machines, and motivation, you are in the right place."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {audiences.map((item) => (
              <div
                key={item}
                className="group rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-red-500/50 hover:bg-red-500/[0.06]"
              >
                <div className="mb-4 h-1.5 w-10 rounded-sm bg-red-500 shadow-[0_0_22px_rgba(220,38,38,0.5)]" />
                <p className="text-sm font-semibold leading-6 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="border-b border-white/10 bg-[#080808] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Services"
          title="Choose the entry point that matches your intent."
          body="Consultations clarify the mission. Coaching builds the body. Every offer is designed around execution, standards, and measurable performance."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d] shadow-[0_24px_90px_rgba(0,0,0,0.36)] transition hover:-translate-y-1 hover:border-red-500/50"
            >
              <div className="relative aspect-[1.1] overflow-hidden border-b border-white/10">
                <Image
                  src={service.image}
                  alt={`${service.title} for HTK Training`}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover grayscale-[16%] transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.1)_0%,rgba(5,5,5,0.82)_100%)]" />
                <span className="absolute left-4 top-4 rounded-md border border-red-500/35 bg-black/60 px-3 py-1.5 text-xs font-black uppercase text-red-200 backdrop-blur">
                  {service.meta}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-black text-white">{service.title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-white/60">{service.body}</p>
                <CtaLink
                  href={service.href}
                  external={service.external}
                  size="card"
                  className="mt-6 border border-red-500/45 bg-red-500/10 hover:border-red-400"
                >
                  {service.cta}
                </CtaLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyHtk() {
  return (
    <section className="border-b border-white/10 bg-[#050505] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionIntro
              align="left"
              eyebrow="Why HTK"
              title="This is performance coaching, not generic fitness with a hard font."
              body="The goal is not to entertain you with random pain. The goal is to build a body that expresses force, owns positions, carries work capacity, and stays composed."
            />
            <div className="mt-8 space-y-3">
              {differences.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4"
                >
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-red-500" />
                  <p className="text-sm leading-6 text-white/70">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#111]">
            <Image
              src="/htk/train-for-real-life.png"
              alt="HTK Training train for real life"
              width={1376}
              height={768}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_0%,rgba(5,5,5,0.45)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-b border-white/10 bg-[#080808] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <ImagePanel
              src="/htk/nmu-football.jpg"
              alt="Northern Michigan football athlete"
              label="Northern Michigan football"
              className="aspect-[4/5]"
            />
            <ImagePanel
              src="/htk/htk-training-01.jpg"
              alt="Marine Corps background"
              label="Marine Corps background"
              className="aspect-[4/3]"
            />
          </div>
          <div>
            <SectionIntro
              align="left"
              eyebrow="Coach credibility"
              title="Athlete-built. Military-tested. Performance-focused."
              body="HTK Training comes from lived standards: multi-sport athletics, collegiate football at Northern Michigan, Marine Corps discipline, and a specialization in building athletic bodies that can handle pressure."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <StatCard value="Multi-sport" label="Athletic base" />
              <StatCard value="NMU" label="Collegiate football" />
              <StatCard value="USMC" label="Marine Corps background" />
              <StatCard value="HTK" label="Performance system" />
            </div>
            <div className="mt-8 rounded-lg border border-red-500/25 bg-red-500/[0.055] p-6">
              <p className="text-lg font-black text-white">The standard is simple.</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Move well. Hit hard. Last longer. Recover smarter. Repeat the work
                until performance becomes identity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="border-b border-white/10 bg-[#050505] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Process"
          title="A simple system for serious execution."
          body="No bloated course library. No guessing. Every step exists to create a stronger, faster, more capable body."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-black text-red-400">0{index + 1}</span>
                <Target className="size-5 text-white/40" />
              </div>
              <h3 className="text-xl font-black text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/60">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Results() {
  return (
    <section id="results" className="border-b border-white/10 bg-[#080808] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionIntro
              align="left"
              eyebrow="Results"
              title="Train for the kind of body people can feel in the room."
              body="The outcome is not only aesthetics. It is movement, output, pressure tolerance, and the confidence that comes from earned capability."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {results.map((result) => (
                <div key={result} className="flex gap-3 rounded-lg border border-white/10 bg-[#0d0d0d] p-4">
                  <span className="mt-2 h-1.5 w-8 shrink-0 rounded-sm bg-red-500 shadow-[0_0_18px_rgba(220,38,38,0.48)]" />
                  <p className="text-sm font-semibold leading-6 text-white/75">{result}</p>
                </div>
              ))}
            </div>
          </div>
          <ImagePanel
            src="/htk/gym-operator.jpg"
            alt="HTK Training athlete in a performance setting"
            label="Pressure-ready performance"
            className="aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="border-b border-white/10 bg-[#050505] py-20 md:py-24">
      <div className="container-px mx-auto max-w-7xl">
        <SectionIntro
          eyebrow="Testimonials"
          title="Proof should sound like performance."
          body="Real coaching is measured by better output, cleaner movement, stronger endurance, and a higher standard of execution."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)]"
            >
              <RatingPips />
              <p className="mt-7 text-xl font-black leading-8 text-white">
                {`"${testimonial.quote}"`}
              </p>
              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="font-black text-white">{testimonial.name}</p>
                <p className="mt-1 text-sm text-white/50">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Socials() {
  return (
    <section id="contact" className="border-b border-white/10 bg-[#080808] py-16 md:py-20">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <SectionIntro
            align="left"
            eyebrow="Channels"
            title="Join the HTK ecosystem."
            body="Follow the training standard, watch the work, and start the conversation when you are ready to move."
          />
          <div className="grid gap-3 sm:grid-cols-5">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] text-center transition hover:border-red-500/50 hover:bg-red-500/[0.08]"
                >
                  <span className="grid size-11 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-sm font-black text-white shadow-[0_0_26px_rgba(220,38,38,0.18)]">
                    {Icon ? <Icon className="size-5" /> : social.textIcon}
                  </span>
                  <span className="text-sm font-black text-white/80 group-hover:text-white">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>
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
        alt="HTK Training visual"
        fill
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover opacity-[0.28] grayscale-[12%]"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.82)_0%,rgba(5,5,5,0.7)_44%,rgba(5,5,5,0.94)_100%)]" />
      <div className="container-px mx-auto max-w-5xl text-center">
        <Badge>Hard to Kill starts with a decision</Badge>
        <h2 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
          Stop training around the standard. Become the standard.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
          Book the consultation, apply for coaching, and get a clear path toward
          explosiveness, endurance, mobility, and real-world capability.
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

function Footer() {
  return (
    <footer className="bg-[#050505] py-8 pb-24 md:pb-8">
      <div className="container-px mx-auto flex max-w-7xl flex-col gap-5 text-sm text-white/40 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-semibold text-white/60">HTK Training</p>
          <p className="mt-2">Hard to Kill Training. Built for real-world performance.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-white/55">
          <Link href="/free-resources" className="transition hover:text-white">
            Free Resources
          </Link>
          <Link href="/privacy-policy" className="transition hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="transition hover:text-white">
            Terms of Service
          </Link>
          <a href="mailto:contact@htktrainingco.com" className="transition hover:text-white">
            Contact
          </a>
          <a href="mailto:support@htktrainingco.com" className="transition hover:text-white">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

function MobileCta() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-[1.25fr_0.75fr_0.75fr] gap-2 border border-white/10 bg-[#070707]/90 p-2 shadow-[0_0_40px_rgba(0,0,0,0.55)] backdrop-blur md:hidden">
      <Link
        href="/signup"
        className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-500 px-3 text-center text-sm font-black leading-tight text-white shadow-[0_0_30px_rgba(220,38,38,0.35)]"
      >
        Start Membership
      </Link>
      <a
        href={HTK_BOOKING_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-3 text-sm font-black text-white"
      >
        Book
      </a>
      <Link
        href={HTK_APPLICATION_PATH}
        className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-3 text-sm font-black text-white"
      >
        Apply
      </Link>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
  align = "center"
}: {
  eyebrow: string;
  title: string;
  body: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-sm font-black uppercase text-red-400">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-white/60">{body}</p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  children
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.035] p-6 transition hover:border-red-500/50 hover:bg-red-500/[0.055]">
      <div className="mb-8 grid size-12 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-400">
        <Icon className="size-5" />
      </div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/60">{children}</p>
    </article>
  );
}

function ImagePanel({
  src,
  alt,
  label,
  className = "aspect-[4/5]"
}: {
  src: string;
  alt: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-white/10 bg-[#111] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="object-cover grayscale-[10%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0)_0%,rgba(5,5,5,0.78)_100%)]" />
      <div className="absolute bottom-4 left-4 right-4 rounded-md border border-white/10 bg-black/60 px-4 py-3 text-sm font-black uppercase text-white/80 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm font-semibold text-white/50">{label}</p>
    </div>
  );
}

function RatingPips() {
  return (
    <div className="flex gap-1.5" aria-label="Five credibility markers">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="h-2 w-7 rounded-sm bg-red-500 shadow-[0_0_16px_rgba(220,38,38,0.42)]" />
      ))}
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black uppercase text-white/70 shadow-[0_0_36px_rgba(220,38,38,0.12)] backdrop-blur">
      <Dumbbell className="mr-2 size-4 text-red-400" />
      {children}
    </div>
  );
}
