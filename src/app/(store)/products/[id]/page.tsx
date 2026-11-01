import { Suspense } from "react";
import { ProductDetailContent } from "./product-detail-content";

type Props = { params: Promise<{ id: string }> };

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-[4/3] rounded-3xl bg-stone-200 animate-pulse" />
        <div className="space-y-3">
          <div className="h-8 w-2/3 rounded bg-stone-200 animate-pulse" />
          <div className="h-6 w-1/3 rounded bg-stone-100 animate-pulse" />
          <div className="h-24 rounded bg-stone-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}