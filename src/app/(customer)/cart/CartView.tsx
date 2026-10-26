"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { checkoutOnlineAction } from "@/actions/order.actions";
import { useCart } from "@/components/customer/CartProvider";
import { rupiah } from "@/lib/format";

export function CartView() {
  const { lines, total, ready, setQty, remove, clear } = useCart();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function checkout() {
    setError("");
    start(async () => {
      const res = await checkoutOnlineAction(lines.map((l) => ({ productId: l.productId, qty: l.qty })));
      if ("error" in res) return setError(res.error ?? '');
      clear();
      router.push("/orders");
    });
  }

  if (!ready) return <div className="h-40 animate-pulse rounded-3xl bg-stone-200" />;

  if (lines.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center">
        <p className="text-stone-500">Keranjangmu masih kosong.</p>
        <Link href="/shop" className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">
          Mulai belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <ul className="space-y-3">
        {lines.map((l) => (
          <li key={l.productId} className="flex items-center gap-4 rounded-3xl border border-stone-200 bg-white p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-stone-900">{l.name}</p>
              <p className="text-sm text-stone-500">{rupiah(l.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQty(l.productId, l.qty - 1)}
                className="grid size-8 place-items-center rounded-lg border border-stone-200"
                aria-label="Kurangi"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
              <button
                onClick={() => setQty(l.productId, l.qty + 1)}
                disabled={l.qty >= l.stock}
                className="grid size-8 place-items-center rounded-lg border border-stone-200 disabled:opacity-40"
                aria-label="Tambah"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button onClick={() => remove(l.productId)} className="text-stone-400 hover:text-red-600" aria-label="Hapus">
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-3xl bg-emerald-950 p-6 text-white">
        <p className="text-sm text-emerald-200">Total</p>
        <p className="mt-1 text-3xl font-bold">{rupiah(total)}</p>
        <p className="mt-3 text-xs leading-relaxed text-emerald-200">
          Pembayaran dilakukan di toko saat kamu mengambil pesanan. Harga final dihitung ulang oleh toko.
        </p>
        {error && <p role="alert" className="mt-4 rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-100">{error}</p>}
        <button
          onClick={checkout}
          disabled={pending}
          className="mt-5 w-full rounded-xl bg-emerald-400 py-3 font-semibold text-emerald-950 hover:bg-emerald-300 disabled:opacity-60"
        >
          {pending ? "Mengirim…" : "Kirim pesanan"}
        </button>
      </aside>
    </div>
  );
}