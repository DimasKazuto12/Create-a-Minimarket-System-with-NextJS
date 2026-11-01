import Link from "next/link";
import { rupiah } from "@/lib/format";
import { tileFor } from "@/lib/tile";
import { AddToCartButton } from "./AddToCartButton";

type P = { id: string; name: string; price: number; stock: number; minStock: number };

export function ProductCard({ product, category }: { product: P; category?: string }) {
  const href = `/products/${product.id}`;
  const status =
    product.stock === 0 ? "Stok habis" : product.stock <= product.minStock ? `Sisa ${product.stock}` : "Tersedia";

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-900/5">
      <Link href={href} className={`relative grid aspect-[4/3] place-items-center overflow-hidden ${tileFor(product.name)}`}>
        <span className="font-display text-6xl font-bold transition duration-300 group-hover:scale-110">
          {product.name.charAt(0).toUpperCase()}
        </span>
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-stone-700 backdrop-blur">
            {category}
          </span>
        )}
        {product.stock > 0 && product.stock <= product.minStock && (
          <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-white">
            Segera habis
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <Link href={href} className="line-clamp-2 text-sm font-semibold text-stone-900 hover:text-emerald-700">
          {product.name}
        </Link>
        <p className="font-display text-lg font-bold text-emerald-700">{rupiah(product.price)}</p>
        <p className="mb-3 text-xs text-stone-400">{status}</p>
        <div className="mt-auto">
          <AddToCartButton product={{
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
          }} />
        </div>
      </div>
    </article>
  );
}