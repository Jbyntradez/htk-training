import { ButtonLink } from "@/components/ui/button";

export function Authority() {
  return (
    <section className="py-24 md:py-28">
      <div className="container-px mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">Authority</p>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
            No hype. No personality cult. Just a sharper operating system.
          </h2>
        </div>
        <div className="border-l border-white/10 pl-6">
          <p className="text-lg leading-8 text-accent/70">
            Hard to Kill Training is built for people who want the edge without the spectacle:
            AI systems, faceless content, monetization architecture, and daily execution.
          </p>
          <ButtonLink href="/checkout" className="mt-8 w-full sm:w-auto">Access the System</ButtonLink>
        </div>
      </div>
    </section>
  );
}
