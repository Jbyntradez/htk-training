import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ScarcityBanner } from "@/components/ScarcityBanner";
import { CheckoutButton } from "@/components/CheckoutButton";
import { modules } from "@/lib/content";
import { Check } from "lucide-react";

const stack = [
  "AI offer research prompts",
  "Faceless content publishing system",
  "Monetization blueprint",
  "Launch checklist",
  "Progress dashboard",
  "Bonus resource vault"
];

export default function ProductPage() {
  return (
    <>
      <ScarcityBanner />
      <Navbar />
      <main>
        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="container-px mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.75fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase text-accent/45">The playbook</p>
              <h1 className="mt-4 text-5xl font-black leading-[0.95] sm:text-7xl">
                Build the machine behind the income.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-accent/65">
                A digital operating system for AI business, faceless content, and monetization systems.
              </p>
              <div className="mt-9">
                <CheckoutButton />
              </div>
            </div>
            <div className="rounded-md border border-white/10 bg-primary p-6">
              <p className="text-sm font-black uppercase text-accent/45">Included</p>
              <div className="mt-5 grid gap-4">
                {stack.map((item) => (
                  <div key={item} className="flex gap-3 text-sm font-bold">
                    <Check className="h-5 w-5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="container-px mx-auto max-w-7xl">
            <h2 className="text-4xl font-black">Modules</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {modules.map((module) => (
                <article key={module.id} className="rounded-md border border-white/10 bg-primary p-6">
                  <p className="text-xs font-black uppercase text-accent/45">{module.duration}</p>
                  <h3 className="mt-3 text-2xl font-black">{module.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-accent/60">{module.deck}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
