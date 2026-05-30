import { SupabaseLoginForm } from "@/components/auth/SupabaseLoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <section className="w-full max-w-md rounded-md border border-white/10 bg-primary p-6 text-center shadow-premium">
        <p className="text-sm font-black uppercase text-accent/45">HTK Operator Platform</p>
        <h1 className="mt-3 text-4xl font-black">Sign in</h1>
        <p className="mt-4 text-sm leading-6 text-accent/60">
          Use the Supabase Auth account assigned to your HTK profile.
        </p>
        <SupabaseLoginForm />
      </section>
    </main>
  );
}
