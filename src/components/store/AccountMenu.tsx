"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, ReceiptText } from "lucide-react";
import { logoutAction } from "@/actions/auth.actions";
import { useCart } from "@/components/customer/CartProvider";
import { HOME_BY_ROLE, ROLE_LABEL } from "@/lib/rbac";
import type { AuthUser } from "./AuthModal";

export function AccountMenu({ user }: { user: NonNullable<AuthUser> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { clear } = useCart();
  const isStaff = user.role !== "CUSTOMER";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 ring-1 ring-stone-200 hover:bg-stone-50"
      >
        <span className="grid size-8 place-items-center rounded-full bg-accent text-sm font-bold text-white">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-24 truncate text-sm font-semibold text-stone-800 sm:block">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown className={`size-4 text-stone-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-60 rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl shadow-stone-900/10 animate-pop"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-sm font-bold text-stone-900">{user.name}</p>
            <p className="text-xs text-stone-500">{ROLE_LABEL[user.role]}</p>
          </div>
          <div className="my-1 h-px bg-stone-100" />

          {isStaff ? (
            <Link href={HOME_BY_ROLE[user.role]} role="menuitem" className={item} onClick={() => setOpen(false)}>
              <LayoutDashboard className="size-4 text-stone-400" /> Buka dashboard staf
            </Link>
          ) : (
            <Link href="/orders" role="menuitem" className={item} onClick={() => setOpen(false)}>
              <ReceiptText className="size-4 text-stone-400" /> Pesanan saya
            </Link>
          )}

          <form action={logoutAction} onSubmit={() => clear()}>
            <button role="menuitem" className={`${item} text-red-600 hover:bg-red-50`}>
              <LogOut className="size-4" /> Keluar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}