"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReceiptText, ShoppingCart, Store } from "lucide-react";
import { useCart } from "./CartProvider";

export function CustomerBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  const items = [
    { href: "/shop", label: "Belanja", Icon: Store },
    { href: "/cart", label: "Keranjang", Icon: ShoppingCart, badge: count },
    { href: "/orders", label: "Pesanan", Icon: ReceiptText },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {items.map(({ href, label, Icon, badge }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 py-3 text-xs font-medium ${
                active ? "text-emerald-700" : "text-stone-400"
              }`}
            >
              <span className="relative">
                <Icon className="size-5" />
                {!!badge && (
                  <span className="absolute -right-2.5 -top-2 grid min-w-4 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold leading-4 text-white">
                    {badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}