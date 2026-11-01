import { Suspense } from "react";
import { ProductsContent } from "./products-content";

type Props = {
  searchParams: Promise<{ q?: string; kategori?: string; urut?: string }>;
};

export const metadata = { title: "Produk" };

function ProductsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <div className="h-7 w-48 rounded bg-stone-200 animate-pulse" />
        <div className="h-4 w-64 rounded bg-stone-100 animate-pulse" />
      </div>
      <div className="mb-6 h-12 rounded-xl bg-stone-200 animate-pulse" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-3xl border border-stone-200 bg-white animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsContent searchParams={searchParams} />
    </Suspense>
  );
}