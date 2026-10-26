import Link from "next/link";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";
import { formatDateTime, rupiah } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { connection } from "next/server";

export async function OrdersContent() {
  await connection();
  const session = await requireRole("CUSTOMER");

  const orders = await db.orm.public.Order
    .where({ customerId: session.userId })
    .orderBy((o) => o.createdAt.desc())
    .limit(50)
    .all();

  const items = await db.orm.public.OrderItem
    .where((i) => i.orderId.in(orders.map((o) => o.id)))
    .include("product")
    .all();

  const byOrder = new Map<string, typeof items>();
  for (const it of items) {
    const list = byOrder.get(it.orderId) ?? [];
    list.push(it);
    byOrder.set(it.orderId, list);
  }

  return (
    <>
      <PageHeader title="Pesanan Saya" description="Pantau status pesananmu. Tunjukkan kode pesanan saat mengambil di toko." />

      <div className="space-y-3">
        {orders.map((o) => (
          <article key={o.id} className="rounded-3xl border border-stone-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold text-stone-900">{o.code}</p>
                <p className="text-xs text-stone-500">{formatDateTime(o.createdAt)}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <ul className="my-4 space-y-1 text-sm text-stone-700">
              {(byOrder.get(o.id) ?? []).map((it) => (
                <li key={it.id} className="flex justify-between gap-3">
                  <span>{it.qty}× {it.product.name}</span>
                  <span className="text-stone-500">{rupiah(it.subtotal)}</span>
                </li>
              ))}
            </ul>
            <p className="border-t border-stone-100 pt-3 text-right font-bold text-stone-900">{rupiah(o.total)}</p>
          </article>
        ))}

        {orders.length === 0 && (
          <div className="rounded-3xl border border-dashed border-stone-300 p-12 text-center">
            <p className="text-stone-500">Kamu belum punya pesanan.</p>
            <Link href="/shop" className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white">
              Belanja sekarang
            </Link>
          </div>
        )}
      </div>
    </>
  );
}