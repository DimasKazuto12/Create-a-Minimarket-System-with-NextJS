import { Suspense } from "react";
import { InventoryContent } from "./inventory-content";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

function InventorySkeleton() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <div className="h-7 w-40 rounded bg-stone-200 animate-pulse" />
        <div className="h-4 w-72 rounded bg-stone-100 animate-pulse" />
      </div>
      <div className="h-64 rounded-3xl bg-stone-200 animate-pulse" />
    </>
  );
}

export default function InventoryPage({searchParams}: Props) {
  return (
    <Suspense fallback={<InventorySkeleton />}>
      <InventoryContent searchParams={searchParams}/>
    </Suspense>
  );
}