import { getSession } from "@/lib/auth";
import { CartProvider } from "@/components/customer/CartProvider";
import { AuthModalProvider } from "./AuthModal";
import { StoreHeader } from "./StoreHeader";
import { StoreBottomNav } from "./StoreBottomNav";
import { StoreFooter } from "./StoreFooter";

export default async function StoreShell({ children }: { children: React.ReactNode }) {
  const session = await getSession(); // null untuk tamu
  const user = session ? { name: session.name, role: session.role } : null;

  return (
    <CartProvider>
      <AuthModalProvider user={user}>
        <div className="flex min-h-dvh flex-col">
          <StoreHeader />
          <main className="flex-1 pb-20 lg:pb-0">{children}</main>
          <StoreFooter />
          <StoreBottomNav />
        </div>
      </AuthModalProvider>
    </CartProvider>
  );
}