"use client";

import { useState, useTransition } from "react";
import BarcodeScanner from "@/components/cashier/BarcodeScanner";
import { findProductByBarcode, checkoutPosAction } from "@/actions/order.actions";

type CartLine = { productId: string; name: string; price: number; qty: number; stock: number };

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export default function CashierClient() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [message, setMessage] = useState<string>("");
  const [manual, setManual] = useState("");
  const [pending, startTransition] = useTransition();

  const total = cart.reduce((sum, l) => sum + l.price * l.qty, 0);

  async function addByBarcode(code: string) {
    const product = await findProductByBarcode(code);
    if (!product) return setMessage(`Barcode ${code} tidak ditemukan`);
    if (product.stock < 1) return setMessage(`Stok "${product.name}" habis`);

    setMessage("");
    setCart((prev) => {
      const found = prev.find((l) => l.productId === product.id);
      if (found) {
        if (found.qty >= product.stock) {
          setMessage(`Stok "${product.name}" hanya ${product.stock}`);
          return prev;
        }
        return prev.map((l) => (l.productId === product.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1, stock: product.stock }];
    });
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, qty: Math.min(l.qty + delta, l.stock) } : l))
        .filter((l) => l.qty > 0)
    );
  }

  function pay(method: "CASH" | "QRIS" | "TRANSFER") {
    startTransition(async () => {
      const res = await checkoutPosAction(
        cart.map((l) => ({ productId: l.productId, qty: l.qty })),
        method
      );
      if ("error" in res && res.error) return setMessage(res.error);
      setCart([]);
      setMessage(`Transaksi berhasil: ${res.code}`);
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="space-y-4">
        <BarcodeScanner onScan={addByBarcode} />

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (manual.trim()) addByBarcode(manual.trim());
            setManual("");
          }}
        >
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Ketik barcode manual…"
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 outline-none focus:border-emerald-500"
          />
          <button className="rounded-xl bg-neutral-900 px-5 text-white">Tambah</button>
        </form>

        {message && <p className="text-sm text-neutral-600">{message}</p>}
      </section>

      <aside className="rounded-3xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Pesanan</h2>

        <ul className="space-y-3">
          {cart.map((l) => (
            <li key={l.productId} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{l.name}</p>
                <p className="text-sm text-neutral-500">{rupiah(l.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => changeQty(l.productId, -1)} className="size-8 rounded-full border">−</button>
                <span className="w-6 text-center">{l.qty}</span>
                <button onClick={() => changeQty(l.productId, 1)} className="size-8 rounded-full border">+</button>
              </div>
            </li>
          ))}
          {cart.length === 0 && <p className="text-sm text-neutral-400">Scan barang untuk memulai</p>}
        </ul>

        <div className="mt-6 flex items-center justify-between border-t pt-4 text-lg font-semibold">
          <span>Total</span>
          <span>{rupiah(total)}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {(["CASH", "QRIS", "TRANSFER"] as const).map((m) => (
            <button
              key={m}
              disabled={pending || cart.length === 0}
              onClick={() => pay(m)}
              className="rounded-xl bg-emerald-600 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              {m}
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}