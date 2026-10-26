import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";
import { rupiah } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { AddProductForm } from "./AddProductForm";
import { StockActions } from "./StockActions";
import { io } from "next/cache";

type Props = { searchParams: Promise<{ q?: string }> };

function StockBadge({ stock, min }: { stock: number; min: number }) {
  if (stock === 0)
    return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Habis</span>;
  if (stock <= min)
    return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">Menipis</span>;
  return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">Aman</span>;
}

export async function InventoryContent({ searchParams }: Props) {
  await io();
  await requireRole("INVENTORY_ADMIN", "SUPER_ADMIN");
  const { q } = await searchParams;
  const term = (q ?? "").trim().toLowerCase();

  const all = await db.orm.public.Product
    .where({ isActive: true })
    .orderBy((p) => p.name.asc())
    .all();

  const products = term
    ? all.filter((p) => p.name.toLowerCase().includes(term) || p.barcode.toLowerCase().includes(term))
    : all;

  const empty = all.filter((p) => p.stock === 0).length;
  const low = all.filter((p) => p.stock > 0 && p.stock <= p.minStock).length;
  const stockValue = all.reduce((sum, p) => sum + p.stock * p.price, 0);

  return (
    <>
      <PageHeader title="Stok Barang" description="Tambah barang, tambah stok, dan pantau yang menipis." />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-emerald-600 p-5 text-white">
          <p className="text-sm opacity-80">Jenis barang</p>
          <p className="mt-1 text-3xl font-bold">{all.length}</p>
        </div>
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-800">Stok menipis</p>
          <p className="mt-1 text-3xl font-bold text-amber-900">{low}</p>
        </div>
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm text-red-700">Habis</p>
          <p className="mt-1 text-3xl font-bold text-red-800">{empty}</p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Nilai stok</p>
          <p className="mt-1 text-2xl font-bold text-stone-900">{rupiah(stockValue)}</p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-stone-200 bg-white p-5">
        <h2 className="mb-4 font-semibold text-stone-900">Tambah barang baru</h2>
        <AddProductForm />
      </div>

      <form action="/inventory" className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari nama atau barcode…"
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:max-w-sm"
        />
      </form>

      <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-400">
            <tr>
              <th className="px-5 py-3 font-medium">Barang</th>
              <th className="px-5 py-3 font-medium">Harga</th>
              <th className="px-5 py-3 font-medium">Stok</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4">
                  <p className="font-semibold text-stone-900">{p.name}</p>
                  <p className="font-mono text-xs text-stone-400">{p.barcode}</p>
                </td>
                <td className="px-5 py-4">{rupiah(p.price)}</td>
                <td className="px-5 py-4 font-semibold">{p.stock}</td>
                <td className="px-5 py-4">
                  <StockBadge stock={p.stock} min={p.minStock} />
                </td>
                <td className="px-5 py-4">
                  <StockActions productId={p.id} name={p.name} />
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-stone-400">
                  {term ? "Tidak ada barang yang cocok." : "Belum ada barang. Tambahkan di atas."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}