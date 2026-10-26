"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ScanLine, ShoppingBag, Boxes, Clock, Users } from "lucide-react";
import type { StaffIcon } from "@/lib/rbac";

const ICONS = {
  dashboard: LayoutDashboard,
  cashier: ScanLine,
  orders: ShoppingBag,
  stock: Boxes,
  clock: Clock,
  users: Users,
} as const;

type Item = { href: string; label: string; icon: StaffIcon };

function useActive() {
  const pathname = usePathname();
  return (href: string) => pathname === href || pathname.startsWith(href + "/");
}

export function SidebarNav({ items }: { items: Item[] }) {
  const isActive = useActive();
  return (
    <nav className="flex flex-col gap-1">
      {items.map(({ href, label, icon }) => {
        const Icon = ICONS[icon];
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Icon className="size-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

// Menu geser horizontal untuk HP
export function ScrollNav({ items }: { items: Item[] }) {
  const isActive = useActive();
  return (
    <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
            isActive(href) ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-600"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}