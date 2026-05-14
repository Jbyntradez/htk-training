import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Download, FileText, ShieldCheck, Target, Utensils } from "lucide-react";
import { CtaLink } from "@/components/htk/CtaLink";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";

export const metadata: Metadata = {
  title: "Free Resources | HTK Training",
  description:
    "Download free HTK Training performance guides for abs, nutrition, and elite physical development."
};

const resources = [
  {
    title: "HTK 6 Pack Abs Field Manual",
    description:
      "A tactical core conditioning guide built to help you strip body fat, train your abs with intent, and build a stronger midsection.",
    href: "/resources/htk-6-pack-abs-field-manual.pdf",
    meta: "Core conditioning",
    pages: "14-page field manual",
    icon: Target
  },
  {
    title: "HTK 21 Fueling Protocols",
    description:
      "21 calorie-tiered meal plans designed to help you fuel performance, hit protein targets, and stay consistent.",
    href: "/resources/htk-21-fueling-protocols.pdf",
    meta: "Nutrition protocols",
    pages: "27-page fueling guide",
    icon: Utensils
  }
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Results", href: "/#results" },
  { label: "Free Resources", href: "/free-resources" },
  { label: "Apply", href: HTK_APPLICATION_PATH }
];

export default function FreeResourcesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <Header />
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/htk/train-for-real-life.png"
          alt="HTK Training performance standard"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover opacity-[0.24] grayscale-[12%]"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.76)_0%,rgba(5,5,5,0.88)_48%,rgba(5,5,5,0.98)_100%)]" />
        <div className="container-px mx-auto max-w-7xl py-16 sm:py-20 lg:py-24">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to HTK Training
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.74fr] lg:items-end">
            <div className="max-w-4xl">
              <div className="inline-flex items-center rounded-md border border-red-500/35 bg-red-500/[0.08] px-4 py-2 text-xs font-black uppercase text-red-200 shadow-[0_0_36px_rgba(220,38,38,0.16)] backdrop-blur">
                <FileText className="mr-2 size-4" />
                Free Resources
              </div>
              <h1 className="mt-6 text-4xl font-black leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl">
                FREE HTK TRAINING RESOURCES
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
                Download elite performance guides built to help you train harder, fuel
                smarter, and build a body that is hard to kill.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/50 p-5 shadow-[0_26px_100px_rgba(0,0,0,0.38)] backdrop-blur sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <Signal label="Format" value="Direct PDF downloads" />
                <Signal label="Focus" value="Abs, nutrition, execution" />
                <Signal label="Standard" value="Built for disciplined training" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080808] py-16 md:py-20">
        <div className="container-px mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-2">
            {resources.map((resource) => {
              const Icon = resource.icon;

              return (
                <article
                  key={resource.title}
                  className="group flex min-h-full flex-col rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] transition hover:-translate-y-1 hover:border-red-500/45 hover:bg-red-500/[0.055] sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="grid size-12 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-300 shadow-[0_0_26px_rgba(220,38,38,0.16)]">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-md border border-white/10 bg-black/40 px-3 py-1.5 text-xs font-black uppercase text-white/60">
                      {resource.pages}
                    </span>
                  </div>
                  <p className="mt-8 text-sm font-black uppercase text-red-400">
                    {resource.meta}
                  </p>
                  <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl">
                    {resource.title}
                  </h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-white/70 sm:text-base">
                    {resource.description}
                  </p>
                  <a
                    href={resource.href}
                    download
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-500 px-5 text-sm font-black text-white shadow-[0_0_36px_rgba(220,38,38,0.28)] transition hover:bg-red-400 hover:shadow-[0_0_52px_rgba(220,38,38,0.44)] focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[#080808] sm:w-fit"
                  >
                    Download PDF
                    <Download className="ml-2 size-4" />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#050505] py-16 md:py-24">
        <Image
          src="/htk/gym-operator.jpg"
          alt="HTK Training athlete ready for coaching"
          fill
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover opacity-[0.18] grayscale-[18%]"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.86)_0%,rgba(5,5,5,0.78)_42%,rgba(5,5,5,0.96)_100%)]" />
        <div className="container-px mx-auto max-w-5xl text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-300 shadow-[0_0_34px_rgba(220,38,38,0.2)]">
            <ShieldCheck className="size-5" />
          </div>
          <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
            WANT THE FULL HTK SYSTEM?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/70">
            Get coaching, structure, accountability, and a complete performance plan
            built around your goals.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaLink href={HTK_APPLICATION_PATH} className="w-full sm:w-auto">
              Apply for Coaching
            </CtaLink>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
      <div className="container-px mx-auto flex h-[72px] max-w-7xl items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="HTK Training home">
          <span className="grid size-10 place-items-center rounded-md border border-red-500/45 bg-red-500/10 text-sm font-black text-white shadow-[0_0_34px_rgba(220,38,38,0.28)]">
            HTK
          </span>
          <span className="leading-none">
            <span className="block text-base font-black uppercase">HTK</span>
            <span className="block text-[10px] font-bold uppercase text-white/60">Training</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-[13px] font-semibold text-white/60 xl:gap-6 xl:text-sm lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition hover:text-white ${
                item.href === "/free-resources" ? "text-white" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <CtaLink href={HTK_BOOKING_URL} external size="sm">
          Book Now
        </CtaLink>
      </div>
    </header>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-[11px] font-black uppercase text-red-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/75">{value}</p>
    </div>
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
