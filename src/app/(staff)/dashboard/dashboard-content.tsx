import { db } from "@/prisma/db";
import { connection } from "next/server";
import { requireRole } from "@/lib/auth";
import { dayWIB, daysAgoWIB, startOfDayWIB, todayWIB } from "@/lib/date";
import { formatDateTime, formatWeekday, rupiah } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";

export async function DashboardContent() {
  await connection();
  await requireRole("SUPER_ADMIN");
  const today = todayWIB();

  const orders = await db.orm.public.Order
    .where((o) => o.createdAt.gte(startOfDayWIB(6)))
    .where({ status: "COMPLETED" })
    .orderBy((o) => o.createdAt.desc())
    .all();

  const waiting = await db.orm.public.Order
    .where({ channel: "ONLINE" })
    .where((o) => o.status.in(["PENDING", "PREPARING", "READY"]))
    .aggregate((a) => ({ n: a.count() }));

  const products = await db.orm.public.Product.where({ isActive: true }).all();
  const lowStock = products
    .filter((p) => p.stock <= p.minStock)
    .sort((a, b) => a.stock - b.stock);

  const items = await db.orm.public.OrderItem
    .where((i) => i.orderId.in(orders.map((o) => o.id)))
    .include("product")
    .all();

  // Ringkasan hari ini
  const todayOrders = orders.filter((o) => dayWIB(o.createdAt.epochMilliseconds) === today);
  const revenueToday = todayOrders.reduce((s, o) => s + o.total, 0);

  // Omzet 7 hari
  const perDay = Array.from({ length: 7 }, (_, i) => {
    const day = daysAgoWIB(6 - i);
    const total = orders
      .filter((o) => dayWIB(o.createdAt.epochMilliseconds) === day)
      .reduce((s, o) => s + o.total, 0);
    return { day, total };
  });
  const maxDay = Math.max(1, ...perDay.map((d) => d.total));
  const revenueWeek = perDay.reduce((s, d) => s + d.total, 0);

  // Barang terlaris 7 hari
  const sold = new Map<string, { name: string; qty: number }>();
  for (const it of items) {
    const cur = sold.get(it.productId) ?? { name: it.product.name, qty: 0 };
    cur.qty += it.qty;
    sold.set(it.productId, cur);
  }
  const top = [...sold.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <>
      <PageHeader title="Dashboard" description="Ringkasan penjualan toko 7 hari terakhir." />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-emerald-600 p-5 text-white lg:col-span-2">
          <p className="text-sm opacity-80">Omzet hari ini</p>
          <p className="mt-1 text-4xl font-bold tracking-tight">{rupiah(revenueToday)}</p>
          <p className="mt-2 text-sm opacity-80">{todayOrders.length} transaksi selesai</p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Omzet 7 hari</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{rupiah(revenueWeek)}</p>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-800">Pesanan online aktif</p>
          <p className="mt-1 text-3xl font-bold text-amber-900">{waiting.n}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="mb-6 font-semibold text-stone-900">Omzet per hari</h2>
          <div className="flex h-48 items-end gap-3">
            {perDay.map((d) => (
              <div key={d.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  title={rupiah(d.total)}
                  className={`w-full rounded-t-xl ${d.day === today ? "bg-emerald-500" : "bg-emerald-200"}`}
                  style={{ height: `${Math.max(3, (d.total / maxDay) * 100)}%` }}
                />
                <span className="text-xs text-stone-500">{formatWeekday(d.day)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-stone-900">Terlaris minggu ini</h2>
          <ol className="space-y-3 text-sm">
            {top.map((t, i) => (
              <li key={t.name} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-medium text-stone-900">{t.name}</span>
                <span className="text-stone-500">{t.qty} terjual</span>
              </li>
            ))}
            {top.length === 0 && <li className="text-stone-400">Belum ada penjualan.</li>}
          </ol>
        </section>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-stone-900">Perlu restok ({lowStock.length})</h2>
          <ul className="divide-y divide-stone-100 text-sm">
            {lowStock.slice(0, 6).map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2.5">
                <span className="text-stone-800">{p.name}</span>
                <span className={`font-semibold ${p.stock === 0 ? "text-red-600" : "text-amber-700"}`}>
                  {p.stock === 0 ? "Habis" : `Sisa ${p.stock}`}
                </span>
              </li>
            ))}
            {lowStock.length === 0 && <li className="py-4 text-stone-400">Semua stok aman 🎉</li>}
          </ul>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-stone-900">Transaksi terbaru</h2>
          <ul className="divide-y divide-stone-100 text-sm">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-mono text-xs font-semibold text-stone-800">{o.code}</p>
                  <p className="text-xs text-stone-500">
                    {o.channel === "POS" ? "Kasir" : "Online"} · {formatDateTime(o.createdAt)}
                  </p>
                </div>
                <span className="font-semibold text-stone-900">{rupiah(o.total)}</span>
              </li>
            ))}
            {orders.length === 0 && <li className="py-4 text-stone-400">Belum ada transaksi.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}