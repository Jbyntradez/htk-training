import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, FileText, Mail, ShieldCheck, Scale } from "lucide-react";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL } from "@/lib/htk-config";

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

const legalNavItems = [
  { label: "Home", href: "/" },
  { label: "Free Resources", href: "/free-resources" },
  { label: "Apply", href: HTK_APPLICATION_PATH },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" }
];

export function LegalPageLayout({
  activePath,
  eyebrow,
  title,
  intro,
  summaryTitle,
  summaryBody,
  updatedLabel,
  contactEmail,
  sections,
  children
}: {
  activePath: "/privacy-policy" | "/terms-of-service";
  eyebrow: string;
  title: string;
  intro: string;
  summaryTitle: string;
  summaryBody: string;
  updatedLabel: string;
  contactEmail: string;
  sections: readonly LegalSection[];
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <LegalHeader activePath={activePath} />
      <Hero
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        summaryTitle={summaryTitle}
        summaryBody={summaryBody}
        updatedLabel={updatedLabel}
        contactEmail={contactEmail}
      />
      <section className="border-b border-white/10 bg-[#080808] py-14 md:py-20">
        <div className="container-px mx-auto grid max-w-7xl gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-6">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-[24px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)] sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-11 shrink-0 place-items-center rounded-full border border-red-500/35 bg-red-500/[0.08] text-red-300">
                    <ChevronRight className="size-5" />
                  </div>
                  <h2 className="text-2xl font-black text-white sm:text-3xl">{section.title}</h2>
                </div>
                <div className="mt-6 space-y-5 text-sm leading-7 text-white/68 sm:text-[15px]">
                  {section.content}
                </div>
              </article>
            ))}
            {children}
          </div>
          <aside className="xl:sticky xl:top-24 xl:h-fit">
            <div className="rounded-[24px] border border-white/10 bg-[#0c0c0c] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.26)]">
              <p className="text-xs font-black uppercase tracking-wide text-red-400">
                On this page
              </p>
              <nav className="mt-5 grid gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/68 transition hover:border-red-500/35 hover:bg-red-500/[0.06] hover:text-white"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 rounded-xl border border-red-500/25 bg-red-500/[0.055] p-4">
                <p className="text-sm font-black uppercase tracking-wide text-red-200">
                  Important
                </p>
                <p className="mt-2 text-sm leading-7 text-white/70">
                  HTK training content is performance-focused and physical by nature. Review
                  these pages carefully before using the site, training content, downloads,
                  or coaching services.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <LegalFooter />
    </main>
  );
}

function LegalHeader({
  activePath
}: {
  activePath: "/privacy-policy" | "/terms-of-service";
}) {
  return <MarketingNav activeHref={activePath} />;
}

function Hero({
  eyebrow,
  title,
  intro,
  summaryTitle,
  summaryBody,
  updatedLabel,
  contactEmail
}: {
  eyebrow: string;
  title: string;
  intro: string;
  summaryTitle: string;
  summaryBody: string;
  updatedLabel: string;
  contactEmail: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.16),transparent_30%),linear-gradient(180deg,rgba(5,5,5,0.82)_0%,rgba(5,5,5,0.96)_100%)]" />
      <div className="container-px mx-auto max-w-7xl py-16 sm:py-20 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-end">
          <div className="max-w-4xl">
            <div className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-black uppercase text-white/70 shadow-[0_0_36px_rgba(220,38,38,0.12)] backdrop-blur">
              <Scale className="mr-2 size-4 text-red-400" />
              {eyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-black leading-[0.95] text-white sm:text-5xl md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              {intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#document-start"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-500 px-6 text-sm font-black text-white shadow-[0_0_40px_rgba(220,38,38,0.35)] transition hover:bg-red-400 hover:shadow-[0_0_54px_rgba(220,38,38,0.5)]"
              >
                Review Sections
              </a>
              <Link
                href="/"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 bg-white/[0.045] px-6 text-sm font-black text-white transition hover:border-red-500/50 hover:bg-red-500/[0.08]"
              >
                Return Home
              </Link>
            </div>
          </div>
          <div id="document-start" className="rounded-[28px] border border-white/10 bg-[#0c0c0c] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.42)] sm:p-7">
            <div className="grid gap-4 sm:grid-cols-3">
              <SummaryCard
                icon={<FileText className="size-5 text-red-300" />}
                label="Document"
                value={summaryTitle}
              />
              <SummaryCard
                icon={<ShieldCheck className="size-5 text-red-300" />}
                label="Updated"
                value={updatedLabel}
              />
              <SummaryCard
                icon={<Mail className="size-5 text-red-300" />}
                label="Contact"
                value={contactEmail}
              />
            </div>
            <p className="mt-6 text-sm leading-7 text-white/68">{summaryBody}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  icon,
  label,
  value
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 grid size-10 place-items-center rounded-full border border-red-500/35 bg-red-500/[0.08]">
        {icon}
      </div>
      <p className="text-[11px] font-black uppercase tracking-wide text-red-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/78">{value}</p>
    </div>
  );
}

function LegalFooter() {
  return (
    <footer className="bg-[#050505] py-10 pb-24 md:pb-10">
      <div className="container-px mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto_auto] lg:items-start lg:justify-between">
        <div className="max-w-lg">
          <p className="text-sm font-black uppercase tracking-wide text-red-400">HTK Training</p>
          <p className="mt-4 text-base leading-8 text-white/58">
            Hard to Kill Training builds disciplined performance coaching, training
            systems, and resources for athletes and high performers who want real-world
            capability.
          </p>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Navigate</p>
          <div className="mt-4 grid gap-3 text-sm text-white/58">
            {legalNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label === "Privacy" ? "Privacy Policy" : item.label === "Terms" ? "Terms of Service" : item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-white">Action</p>
          <div className="mt-4 grid gap-3 text-sm text-white/58">
            <a
              href={HTK_BOOKING_URL}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              Book a Consultation
            </a>
            <a
              href="mailto:contact@htktrainingco.com"
              className="transition hover:text-white"
            >
              Contact
            </a>
            <a
              href="mailto:support@htktrainingco.com"
              className="transition hover:text-white"
            >
              Support
            </a>
            <Link href={HTK_APPLICATION_PATH} className="transition hover:text-white">
              Apply for Coaching
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
