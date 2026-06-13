import type { Metadata } from "next";
import { CalendarCheck, ShieldCheck } from "lucide-react";
import { CalendlyBooking } from "@/components/CalendlyBooking";
import { CtaLink } from "@/components/htk/CtaLink";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HTK_APPLICATION_PATH, HTK_CALENDLY_URL } from "@/lib/htk-config";

export const metadata: Metadata = {
  title: "Book a Consultation | HTK Training",
  description:
    "Book an HTK Training consultation for coaching, performance direction, and next-step planning."
};

export default function BookPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <MarketingNav activeHref="/book" showBookingCta={false} />

      <section className="border-b border-white/10 bg-[#070707] py-14 md:py-16">
        <div className="container-px mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="inline-flex items-center rounded-md border border-red-500/35 bg-red-500/[0.08] px-4 py-2 text-xs font-black uppercase text-red-200">
              <CalendarCheck className="mr-2 size-4" />
              Consultation booking
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              Book your HTK consultation.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68">
              Use the calendar below to schedule a direct performance consultation.
              Bring your goals, constraints, training history, and the result you want next.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-start gap-4">
              <div className="grid size-11 shrink-0 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-300">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-sm font-black uppercase text-red-300">Want to apply instead?</p>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  If you already know you want coaching, complete the short assessment first.
                </p>
                <CtaLink href={HTK_APPLICATION_PATH} variant="secondary" size="sm" className="mt-4">
                  Apply Now
                </CtaLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10">
        <div className="container-px mx-auto max-w-6xl">
          <CalendlyBooking url={HTK_CALENDLY_URL} />
        </div>
      </section>
    </main>
  );
}
