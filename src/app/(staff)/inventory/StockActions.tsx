"use client";

import { useState, useTransition } from "react";
import { addStockAction, deleteProductAction } from "@/actions/product.actions";

type Props = { productId: string; name: string };

export function StockActions({ productId, name }: Props) {
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function addStock() {
    const n = Number(qty);
    if (!Number.isInteger(n) || n < 1) return setError("Isi jumlah > 0");
    start(async () => {
      const res = await addStockAction(productId, n);
      if ("error" in res && res.error) return setError(res.error);
      setQty("");
      setError("");
    });
  }

  function remove() {
    if (!confirm(`Hapus "${name}"? Riwayat transaksi tetap tersimpan.`)) return;
    start(async () => {
      await deleteProductAction(productId);
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          placeholder="Jumlah"
          className="w-24 rounded-lg border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-emerald-500"
        />
        <button
          onClick={addStock}
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          + Stok
        </button>
        <button
          onClick={remove}
          disabled={pending}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Hapus
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}