import { Suspense } from "react";
import { OnlineOrdersContent } from "./online-orders-content";

function OnlineOrdersSkeleton() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <div className="h-7 w-48 rounded bg-stone-200 animate-pulse" />
        <div className="h-4 w-80 rounded bg-stone-100 animate-pulse" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-56 rounded-3xl border border-stone-200 bg-white p-5 animate-pulse" />
        ))}
      </div>
    </>
  );
}

export default function OnlineOrdersPage() {
  return (
    <Suspense fallback={<OnlineOrdersSkeleton />}>
      <OnlineOrdersContent />
    </Suspense>
  );
}