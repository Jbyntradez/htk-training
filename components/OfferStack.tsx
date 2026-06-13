import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const offers = [
  "Core playbook for AI business execution",
  "Faceless content system for daily publishing",
  "Monetization blueprint for offers and checkout paths",
  "Bonus prompts, trackers, and launch resources"
];

export function OfferStack() {
  return (
    <section className="border-b border-white/10 py-24 md:py-28">
      <div className="container-px mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase text-accent/45">Offer stack</p>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">A complete path from market research to paid checkout.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {offers.map((offer, index) => (
            <div key={offer} className="flex items-start gap-4 rounded-md border border-white/10 bg-primary p-6 transition hover:-translate-y-1 hover:border-white/20">
              <Check className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs font-black uppercase text-accent/40">Layer {index + 1}</p>
                <p className="mt-2 text-lg font-bold leading-7">{offer}</p>
              </div>
            </div>
          ))}
        </div>
        <ButtonLink href="/checkout" className="mt-10 w-full sm:w-auto">Join HTK</ButtonLink>
      </div>
    </section>
  );
}
