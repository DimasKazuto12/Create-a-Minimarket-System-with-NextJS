import { Suspense } from "react";
import { ShopContent } from "./shop-content";

type Props = { searchParams: Promise<{ q?: string }> };

function ShopSkeleton() {
  return <div className="h-64 rounded-3xl bg-stone-200 animate-pulse" />;
}

export default function ShopPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  );
}