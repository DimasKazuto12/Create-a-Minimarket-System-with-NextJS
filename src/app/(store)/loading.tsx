import { PageSkeleton } from "@/components/ui/PageSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageSkeleton />
    </div>
  );
}