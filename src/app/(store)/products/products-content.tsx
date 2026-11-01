import { db } from "@/prisma/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductFilters } from "@/components/store/ProductFilters";
import { connection } from "next/server";

type Props = { searchParams: Promise<{ q?: string; kategori?: string; urut?: string }> };

export const metadata = { title: "Produk" };

export async function ProductsContent({ searchParams }: Props) {
  await connection();
  const { q = "", kategori = "", urut = "terbaru" } = await searchParams;
  const term = q.trim().toLowerCase();

  const categories = await db.orm.public.Category.orderBy((c) => c.name.asc()).all();
  const all = await db.orm.public.Product
    .where({ isActive: true })
    .orderBy((p) => p.createdAt.desc())
    .all();

  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  const filtered = all
    .filter((p) => (term ? p.name.toLowerCase().includes(term) : true))
    .filter((p) => (kategori ? p.categoryId === kategori : true));

  const products = [...filtered].sort((a, b) => {
    if (urut === "termurah") return a.price - b.price;
    if (urut === "termahal") return b.price - a.price;
    if (urut === "nama") return a.name.localeCompare(b.name, "id");
    return 0; // "terbaru": urutan dari query
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader title="Semua produk" description={`${products.length} barang tersedia`} />

      <ProductFilters
        q={q}
        kategori={kategori}
        urut={urut}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => {
          const { createdAt, ...plainProduct } = p;   // 👈 buang createdAt
          return (
            <ProductCard
              key={p.id}
              product={plainProduct}
              category={p.categoryId ? categoryName.get(p.categoryId) : undefined}
            />
          );
        })}
        {products.length === 0 && (
          <p className="col-span-full rounded-3xl border border-dashed border-stone-300 p-12 text-center text-stone-400">
            Tidak ada barang yang cocok dengan pencarianmu.
          </p>
        )}
      </div>
    </div>
  );
}