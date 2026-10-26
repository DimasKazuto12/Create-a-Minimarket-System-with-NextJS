import { logoutAction } from "@/actions/auth.actions";
import { Logo } from "@/components/ui/Logo";
import { requireRole } from "@/lib/auth";
import { ROLE_LABEL, STAFF_NAV, STAFF_ROLES } from "@/lib/rbac";
import { ScrollNav, SidebarNav } from "./StaffNav";

function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-900">
        Keluar
      </button>
    </form>
  );
}

export default async function StaffShell({ children }: { children: React.ReactNode }) {
  const session = await requireRole(...STAFF_ROLES);
  const items = STAFF_NAV.filter((n) => n.roles.includes(session.role)).map(
    ({ href, label, icon }) => ({ href, label, icon })
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-stone-200 bg-white p-5 lg:flex">
        <Logo className="mb-8" />
        <SidebarNav items={items} />
        <div className="mt-auto rounded-2xl bg-stone-50 p-4">
          <p className="truncate text-sm font-semibold text-stone-900">{session.name}</p>
          <p className="text-xs text-stone-500">{ROLE_LABEL[session.role]}</p>
          <div className="-ml-3 mt-2">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Header HP */}
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo />
            <LogoutButton />
          </div>
          <ScrollNav items={items} />
        </header>

        <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}