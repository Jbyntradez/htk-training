import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden border-b border-white/10">
      <Image
        src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85"
        alt="Minimal architectural training environment"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover opacity-28"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0A0A_0%,rgba(10,10,10,0.9)_38%,rgba(10,10,10,0.58)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(10,10,10,0)_0%,#0A0A0A_100%)]" />
      <div className="container-px relative mx-auto max-w-7xl py-24 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-end">
          <div className="max-w-4xl animate-fadeUp">
            <Badge>AI Business Playbook</Badge>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.92] tracking-normal text-accent sm:text-7xl lg:text-8xl">
            Build a Faceless AI Income System
          </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-accent/76 sm:text-xl">
              A premium digital playbook for turning AI workflows, faceless content, and monetization systems into a sellable online asset.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/checkout" className="w-full sm:w-auto">Access the System</ButtonLink>
              <ButtonLink href="/product" variant="outline" className="w-full sm:w-auto">View the Playbook</ButtonLink>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 border-t border-white/10 pt-6 text-xs uppercase text-accent/58 sm:grid-cols-3 sm:text-sm">
              <span>AI offer research</span>
              <span>Faceless content engine</span>
              <span>Checkout-ready system</span>
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-primary/82 p-5 shadow-premium backdrop-blur md:p-6">
            <p className="text-xs font-black uppercase text-accent/45">Inside the system</p>
            <div className="mt-5 grid gap-4">
              {[
                ["01", "Find a buyer niche with AI research"],
                ["02", "Publish faceless content without personal exposure"],
                ["03", "Package the offer and send buyers to checkout"]
              ].map(([number, text]) => (
                <div key={number} className="grid grid-cols-[44px_1fr] gap-4 rounded-md border border-white/10 bg-background/60 p-4">
                  <span className="text-sm font-black text-accent/40">{number}</span>
                  <p className="text-sm font-bold leading-6 text-accent/82">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center">
              <div>
                <p className="text-2xl font-black">4</p>
                <p className="mt-1 text-[11px] uppercase text-accent/40">Modules</p>
              </div>
              <div>
                <p className="text-2xl font-black">97</p>
                <p className="mt-1 text-[11px] uppercase text-accent/40">Core offer</p>
              </div>
              <div>
                <p className="text-2xl font-black">0</p>
                <p className="mt-1 text-[11px] uppercase text-accent/40">Face needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
