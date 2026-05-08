import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-px mx-auto flex max-w-7xl flex-col gap-4 text-sm text-accent/50 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Hard to Kill Training. Built for disciplined execution.</p>
        <div className="flex gap-5">
          <Link href="/product" className="hover:text-accent">Product</Link>
          <Link href="/privacy-policy" className="hover:text-accent">Privacy</Link>
          <Link href="/terms-of-service" className="hover:text-accent">Terms</Link>
          <Link href="/login" className="hover:text-accent">Login</Link>
          <Link href="/signup" className="hover:text-accent">Signup</Link>
        </div>
      </div>
    </footer>
  );
}
