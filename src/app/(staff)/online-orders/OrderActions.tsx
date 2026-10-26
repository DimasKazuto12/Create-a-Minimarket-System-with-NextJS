"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/actions/order.actions";

const NEXT: Record<string, { to: string; label: string } | undefined> = {
  PENDING: { to: "PREPARING", label: "Terima & siapkan" },
  PAID: { to: "PREPARING", label: "Siapkan" },
  PREPARING: { to: "READY", label: "Siap diambil" },
  READY: { to: "COMPLETED", label: "Selesai (diambil)" },
};

export function OrderActions({ orderId, status }: { orderId: string; status: string }) {
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const next = NEXT[status];

  function change(to: string) {
    start(async () => {
      const res = await updateOrderStatusAction(orderId, to);
      setError("error" in res && res.error ? res.error : "");
    });
  }

  return (
    <div className="text-right">
      <div className="flex gap-2">
        {next && (
          <button
            disabled={pending}
            onClick={() => change(next.to)}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {next.label}
          </button>
        )}
        <button
          disabled={pending}
          onClick={() => confirm("Batalkan pesanan ini? Stok akan dikembalikan.") && change("CANCELLED")}
          className="rounded-xl px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          Batalkan
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}