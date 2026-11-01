"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogIn, ReceiptText, ShoppingBag, Store } from "lucide-react";
import { useCart } from "@/components/customer/CartProvider";
import { useAuth } from "./AuthModal";

export function StoreBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const { user, openLogin } = useAuth();

  const cls = (active: boolean) =>
    `relative flex flex-col items-center gap-1 py-3 text-[11px] font-semibold ${active ? "text-emerald-700" : "text-stone-400"}`;
  const is = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        <Link href="/" className={cls(is("/"))}>
          <Home className="size-5" /> Beranda
        </Link>
        <Link href="/products" className={cls(is("/products"))}>
          <Store className="size-5" /> Produk
        </Link>
        <Link href="/cart" className={cls(is("/cart"))}>
          <span className="relative">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2.5 -top-2 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-4 text-white">
                {count}
              </span>
            )}
          </span>
          Keranjang
        </Link>
        {user ? (
          <Link href={user.role === "CUSTOMER" ? "/orders" : "/"} className={cls(is("/orders"))}>
            <ReceiptText className="size-5" /> Pesanan
          </Link>
        ) : (
          <button onClick={() => openLogin()} className={cls(false)}>
            <LogIn className="size-5" /> Masuk
          </button>
        )}
      </div>
    </nav>
  );
}