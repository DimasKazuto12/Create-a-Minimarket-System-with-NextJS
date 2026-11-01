"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/customer/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { AccountMenu } from "./AccountMenu";
import { useAuth } from "./AuthModal";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
];

export function StoreHeader() {
  const pathname = usePathname();
  const { count } = useCart();
  const { user, openLogin } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" aria-label="Beranda">
          <Logo />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-emerald-600 text-white" : "text-stone-600 hover:bg-stone-200/60"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <form action="/products" className="relative ml-auto hidden max-w-xs flex-1 md:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            name="q"
            placeholder="Cari produk…"
            className="w-full rounded-full border border-stone-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </form>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/cart"
            aria-label="Keranjang"
            className="relative grid size-10 place-items-center rounded-full bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold leading-5 text-white">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <AccountMenu user={user} />
          ) : (
            <>
              <button
                onClick={() => openLogin("Masuk untuk memesan dan menulis ulasan.")}
                className="hidden rounded-full px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200/60 sm:block"
              >
                Masuk
              </button>
              <button
                onClick={() => openLogin("Daftar gratis, tidak sampai satu menit.")}
                className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
              >
                Daftar
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}