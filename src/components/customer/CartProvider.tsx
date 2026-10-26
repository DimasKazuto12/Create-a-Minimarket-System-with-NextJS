"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { productId: string; name: string; price: number; qty: number; stock: number };

type CartContext = {
  lines: CartLine[];
  count: number;
  total: number;
  ready: boolean;
  add: (p: Omit<CartLine, "qty">) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartContext | null>(null);
const KEY = "minimarket-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setLines(parsed);
    } catch {
      /* abaikan data rusak */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* penyimpanan penuh / diblokir */
    }
  }, [lines, ready]);

  const value = useMemo<CartContext>(
    () => ({
      lines,
      ready,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.price, 0),
      add: (p) =>
        setLines((prev) => {
          const found = prev.find((l) => l.productId === p.productId);
          if (!found) return p.stock > 0 ? [...prev, { ...p, qty: 1 }] : prev;
          return prev.map((l) =>
            l.productId === p.productId
              ? { ...l, stock: p.stock, price: p.price, qty: Math.min(l.qty + 1, p.stock) }
              : l
          );
        }),
      setQty: (productId, qty) =>
        setLines((prev) =>
          prev
            .map((l) => (l.productId === productId ? { ...l, qty: Math.min(qty, l.stock) } : l))
            .filter((l) => l.qty > 0)
        ),
      remove: (productId) => setLines((prev) => prev.filter((l) => l.productId !== productId)),
      clear: () => setLines([]),
    }),
    [lines, ready]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}