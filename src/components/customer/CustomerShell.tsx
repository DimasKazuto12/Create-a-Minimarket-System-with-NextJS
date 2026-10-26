import { logoutAction } from "@/actions/auth.actions";
import { Logo } from "@/components/ui/Logo";
import { requireRole } from "@/lib/auth";
import { CartProvider } from "./CartProvider";
import { CustomerBottomNav } from "./CustomerNav";

export default async function CustomerShell({ children }: { children: React.ReactNode }) {
  const session = await requireRole("CUSTOMER");

  return (
    <CartProvider>
      <div className="min-h-dvh pb-24">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Logo />
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-stone-500 sm:inline">Halo, {session.name.split(" ")[0]}</span>
              <form action={logoutAction}>
                <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100">
                  Keluar
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <CustomerBottomNav />
      </div>
    </CartProvider>
  );
}