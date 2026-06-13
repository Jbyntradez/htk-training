import Image from "next/image";
import type { Metadata } from "next";
import { Mail, ShieldCheck, Target } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { CtaLink } from "@/components/htk/CtaLink";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { HTK_APPLICATION_PATH, HTK_BOOKING_URL, HTK_CONTACT_EMAIL } from "@/lib/htk-config";

export const metadata: Metadata = {
  title: "Contact | HTK Training",
  description:
    "Contact HTK Training for coaching questions, consultations, resource support, and performance training inquiries."
};

const contactSignals = [
  "Coaching fit",
  "Consultation questions",
  "Resource support"
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <MarketingNav activeHref="/contact" />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/htk/gym-operator.jpg"
          alt="HTK Training athlete preparing to train"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover opacity-[0.2] grayscale-[18%]"
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.94)_100%)]" />
        <div className="container-px mx-auto max-w-7xl py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-red-400">HTK contact</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl">
              Ask the next direct question.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/64">
              Reach out about coaching, consultations, resource access, or the best next
              move for your current training phase.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-px mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ContactForm />

          <aside className="space-y-5">
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <div className="grid size-11 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-300">
                <Target className="size-5" />
              </div>
              <p className="mt-5 text-sm font-black uppercase text-red-400">Fastest paths</p>
              <h2 className="mt-3 text-2xl font-black text-white">Choose the right next move.</h2>
              <p className="mt-3 text-sm leading-7 text-white/62">
                Book a consultation for a live conversation, or apply if you are ready
                to be reviewed for coaching.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
                <CtaLink href={HTK_BOOKING_URL} className="w-full">
                  Book Consultation
                </CtaLink>
                <CtaLink href={HTK_APPLICATION_PATH} variant="secondary" className="w-full">
                  Apply Now
                </CtaLink>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#090909] p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-md border border-red-500/35 bg-red-500/10 text-red-300">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase text-red-400">Direct email</p>
                  <a
                    href={`mailto:${HTK_CONTACT_EMAIL}`}
                    className="mt-2 block break-all text-sm font-semibold text-white/75 transition hover:text-white"
                  >
                    {HTK_CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {contactSignals.map((signal) => (
                <div
                  key={signal}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4"
                >
                  <ShieldCheck className="size-5 text-red-300" />
                  <span className="text-sm font-black uppercase text-white/70">{signal}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
