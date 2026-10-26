"use client";

import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/customer/CartProvider";

type Props = { product: { id: string; name: string; price: number; stock: number } };

export function AddToCartButton({ product }: Props) {
  const { lines, add, setQty } = useCart();
  const line = lines.find((l) => l.productId === product.id);

  if (product.stock === 0) {
    return (
      <button disabled className="w-full rounded-xl bg-stone-100 py-2 text-sm font-medium text-stone-400">
        Habis
      </button>
    );
  }

  if (!line) {
    return (
      <button
        onClick={() => add({ productId: product.id, name: product.name, price: product.price, stock: product.stock })}
        className="w-full rounded-xl bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 active:scale-[0.98]"
      >
        Tambah
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-1">
      <button
        onClick={() => setQty(product.id, line.qty - 1)}
        className="grid size-8 place-items-center rounded-lg bg-white text-emerald-700 shadow-sm"
        aria-label="Kurangi"
      >
        <Minus className="size-4" />
      </button>
      <span className="text-sm font-bold text-emerald-800">{line.qty}</span>
      <button
        onClick={() => setQty(product.id, line.qty + 1)}
        disabled={line.qty >= product.stock}
        className="grid size-8 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm disabled:opacity-40"
        aria-label="Tambah"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}