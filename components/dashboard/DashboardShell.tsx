import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserIdentityBadge, ViewStatusBadge, type ViewStatus } from "@/components/dashboard/UserIdentityBadge";
import { mockUser } from "@/lib/access";

type DashboardShellUser = {
  name: string;
  initials: string;
  email?: string;
};

export function DashboardShell({
  children,
  user = mockUser,
  userAction,
  view = "athlete"
}: {
  children: React.ReactNode;
  user?: DashboardShellUser;
  userAction?: React.ReactNode;
  view?: ViewStatus;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-72">
        <div className="flex h-20 items-center justify-between border-b border-white/10 bg-black/20 px-4 backdrop-blur md:px-8">
          <div>
            <p className="text-xs font-black uppercase text-htk-red">Operator dashboard</p>
            <p className="mt-1 hidden text-sm text-htk-muted sm:block">HTK performance operating system</p>
          </div>
          <div className="flex items-center gap-3">
            <ViewStatusBadge view={view} />
            {userAction}
            <UserIdentityBadge user={user} />
          </div>
        </div>
        <div className="container-px mx-auto max-w-6xl py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
