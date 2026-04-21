import { Sidebar } from "@/components/dashboard/Sidebar";
import { mockUser } from "@/lib/access";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-72">
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-4 md:px-8">
          <div>
            <p className="text-xs font-black uppercase text-accent/45">Command room</p>
            <p className="mt-1 hidden text-sm text-accent/60 sm:block">Faceless AI income system</p>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-white/10 bg-primary px-3 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-xs font-black text-background">
              {mockUser.initials}
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-black">{mockUser.name}</p>
              <p className="text-xs text-accent/45">Local preview</p>
            </div>
          </div>
        </div>
        <div className="container-px mx-auto max-w-6xl py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
