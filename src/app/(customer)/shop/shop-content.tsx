import { connection } from "next/server";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";
import { rupiah } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { AddToCartButton } from "./AddToCartButton";

type Props = { searchParams: Promise<{ q?: string }> };

// Kelas ditulis utuh supaya terbaca oleh Tailwind
const TILES = [
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
  "bg-lime-100 text-lime-700",
];

function tileFor(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return TILES[sum % TILES.length];
}

export async function ShopContent({ searchParams }: Props) {
  await connection(); 
  await requireRole("CUSTOMER");
  const { q } = await searchParams;
  const term = (q ?? "").trim().toLowerCase();

  const all = await db.orm.public.Product
    .where({ isActive: true })
    .orderBy((p) => p.name.asc())
    .all();

  const products = term ? all.filter((p) => p.name.toLowerCase().includes(term)) : all;

  return (
    <>
      <PageHeader title="Belanja" description="Pilih barang, lalu ambil di toko saat pesananmu siap." />

      <form action="/shop" className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Cari barang…"
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
      </form>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <article key={p.id} className="flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white">
            <div className={`grid aspect-[4/3] place-items-center text-5xl font-bold ${tileFor(p.name)}`}>
              {p.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <h3 className="line-clamp-2 text-sm font-semibold text-stone-900">{p.name}</h3>
              <p className="text-base font-bold text-emerald-700">{rupiah(p.price)}</p>
              <p className="mb-3 text-xs text-stone-400">
                {p.stock === 0 ? "Stok habis" : p.stock <= p.minStock ? `Sisa ${p.stock}` : "Tersedia"}
              </p>
              <div className="mt-auto">
                <AddToCartButton product={{ id: p.id, name: p.name, price: p.price, stock: p.stock }} />
              </div>
            </div>
          </article>
        ))}

        {products.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-stone-300 p-12 text-center text-stone-400">
            {term ? "Barang tidak ditemukan." : "Belum ada barang yang dijual."}
          </p>
        )}
      </div>
    </>
  );
}