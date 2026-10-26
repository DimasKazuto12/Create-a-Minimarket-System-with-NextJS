export const ORDER_STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Menunggu konfirmasi", className: "bg-amber-100 text-amber-800" },
  PAID: { label: "Dibayar", className: "bg-sky-100 text-sky-800" },
  PREPARING: { label: "Disiapkan", className: "bg-violet-100 text-violet-800" },
  READY: { label: "Siap diambil", className: "bg-emerald-100 text-emerald-800" },
  COMPLETED: { label: "Selesai", className: "bg-stone-200 text-stone-700" },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-100 text-red-700" },
};