import { io } from "next/cache";    
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";
import { formatDateTime, rupiah } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderActions } from "./OrderActions";

const FINAL = new Set(["COMPLETED", "CANCELLED"]);

export async function OnlineOrdersContent() {
  await io();  

  await requireRole("CASHIER", "SUPER_ADMIN");

  const orders = await db.orm.public.Order
    .where({ channel: "ONLINE" })
    .orderBy((o) => o.createdAt.desc())
    .limit(50)
    .include("customer")
    .all();

  const ids = orders.map((o) => o.id);
  const items = await db.orm.public.OrderItem
    .where((i) => i.orderId.in(ids))
    .include("product")
    .all();

  const itemsByOrder = new Map<string, typeof items>();
  for (const it of items) {
    const list = itemsByOrder.get(it.orderId) ?? [];
    list.push(it);
    itemsByOrder.set(it.orderId, list);
  }

  // Pesanan yang masih berjalan tampil di atas
  const sorted = [...orders].sort(
    (a, b) => Number(FINAL.has(a.status)) - Number(FINAL.has(b.status))
  );

  return (
    <>
      <PageHeader
        title="Pesanan Online"
        description="Terima, siapkan, dan selesaikan pesanan dari pelanggan. Pembayaran dilakukan saat barang diambil."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {sorted.map((o) => (
          <article key={o.id} className="rounded-3xl border border-stone-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold text-stone-900">{o.code}</p>
                <p className="text-xs text-stone-500">
                  {o.customer?.name ?? "Pelanggan"} · {formatDateTime(o.createdAt)}
                </p>
              </div>
              <StatusBadge status={o.status} />
            </div>

            <ul className="my-4 space-y-1 text-sm text-stone-700">
              {(itemsByOrder.get(o.id) ?? []).map((it) => (
                <li key={it.id} className="flex justify-between gap-3">
                  <span>
                    {it.qty}× {it.product.name}
                  </span>
                  <span className="text-stone-500">{rupiah(it.subtotal)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4">
              <p className="font-bold text-stone-900">{rupiah(o.total)}</p>
              {!FINAL.has(o.status) && <OrderActions orderId={o.id} status={o.status} />}
            </div>
          </article>
        ))}

        {sorted.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-stone-300 p-12 text-center text-stone-400">
            Belum ada pesanan online.
          </p>
        )}
      </div>
    </>
  );
}