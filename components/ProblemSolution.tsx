import { ButtonLink } from "@/components/ui/button";

const problems = [
  "Stuck trading hours for dollars.",
  "Holding back because you do not want to show your face.",
  "Drowning in tactics instead of building a real online business."
];

const solutions = [
  "AI-driven operating system for research, scripts, offers, and execution.",
  "Step-by-step playbook built around faceless content assets.",
  "Designed for disciplined individuals who want leverage without noise."
];

export function ProblemSolution() {
  return (
    <section id="system" className="border-b border-white/10 py-24 md:py-28">
      <div className="container-px mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-black uppercase text-accent/45">The drag</p>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Most people stay busy and never build the machine.</h2>
          <div className="mt-8 grid gap-4">
            {problems.map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-primary p-6 text-accent/70">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-black uppercase text-accent/45">The system</p>
          <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Build quiet leverage, then make it repeatable.</h2>
          <div className="mt-8 grid gap-4">
            {solutions.map((item) => (
              <div key={item} className="rounded-md border border-white/10 bg-accent p-6 font-bold text-background">
                {item}
              </div>
            ))}
          </div>
          <ButtonLink href="/checkout" className="mt-8 w-full sm:w-auto">Join HTK</ButtonLink>
        </div>
      </div>
    </section>
  );
}
