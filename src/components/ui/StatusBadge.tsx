import { ORDER_STATUS } from "@/lib/order-status";

export function StatusBadge({ status }: { status: string }) {
  const s = ORDER_STATUS[status] ?? { label: status, className: "bg-stone-100 text-stone-600" };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}