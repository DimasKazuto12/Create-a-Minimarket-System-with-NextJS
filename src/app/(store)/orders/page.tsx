import { Suspense } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { OrdersList } from "./orders-content";

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="Pesanan Saya"
        description="Pantau status pesananmu. Tunjukkan kode pesanan saat mengambil di toko."
      />

      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersList />
      </Suspense>
    </>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-32 animate-pulse rounded-3xl border border-stone-200 bg-stone-100"
        />
      ))}
    </div>
  );
}