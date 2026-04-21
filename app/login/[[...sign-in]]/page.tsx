import { ButtonLink } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <section className="w-full max-w-md rounded-md border border-white/10 bg-primary p-6 text-center">
        <p className="text-sm font-black uppercase text-accent/45">Local preview</p>
        <h1 className="mt-3 text-4xl font-black">Login disabled</h1>
        <p className="mt-4 text-sm leading-6 text-accent/60">
          Auth is removed for fast local preview. The dashboard is open with mock user data.
        </p>
        <ButtonLink href="/dashboard" className="mt-6 w-full">Open Dashboard</ButtonLink>
      </section>
    </main>
  );
}
