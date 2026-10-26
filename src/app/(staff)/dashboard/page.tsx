import { Suspense } from "react";
import { DashboardContent } from "./dashboard-content";

function DashboardSkeleton() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <div className="h-7 w-40 rounded bg-stone-200 animate-pulse" />
        <div className="h-4 w-64 rounded bg-stone-100 animate-pulse" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-3xl bg-stone-200 animate-pulse" />
        ))}
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}