import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/85 backdrop-blur">
      <div className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="text-sm font-black uppercase tracking-normal">
          Hard to Kill
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-accent/70 md:flex">
          <Link href="/product" className="hover:text-accent">Playbook</Link>
          <Link href="/#proof" className="hover:text-accent">Results</Link>
          <Link href="/#system" className="hover:text-accent">System</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink href="/dashboard" variant="ghost" className="hidden sm:inline-flex">Preview</ButtonLink>
          <ButtonLink href="/checkout">Access</ButtonLink>
        </div>
      </div>
    </header>
  );
}
