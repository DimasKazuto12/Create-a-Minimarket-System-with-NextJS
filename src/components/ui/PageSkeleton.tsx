export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy>
      <div className="h-9 w-56 rounded-xl bg-stone-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-3xl bg-stone-200" />
        ))}
      </div>
      <div className="h-64 rounded-3xl bg-stone-200" />
    </div>
  );
}