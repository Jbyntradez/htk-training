import { SupabaseSignupForm } from "@/components/auth/SupabaseSignupForm";

export default function SignupPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <section className="w-full max-w-md rounded-md border border-white/10 bg-primary p-6 text-center shadow-premium">
        <p className="text-sm font-black uppercase text-accent/45">HTK Operator Platform</p>
        <h1 className="mt-3 text-4xl font-black">Create account</h1>
        <p className="mt-4 text-sm leading-6 text-accent/60">
          Start the operator intake, then complete your athlete profile.
        </p>
        <SupabaseSignupForm />
      </section>
    </main>
  );
}
