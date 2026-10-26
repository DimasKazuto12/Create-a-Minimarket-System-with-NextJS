const rupiahFmt = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
export const rupiah = (n: number) => rupiahFmt.format(n);

type Instantish = { epochMilliseconds: number };
const TZ = "Asia/Jakarta";

export const formatDateTime = (i: Instantish) =>
  new Date(i.epochMilliseconds).toLocaleString("id-ID", {
    timeZone: TZ, day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

export const formatTime = (i: Instantish) =>
  new Date(i.epochMilliseconds).toLocaleTimeString("id-ID", {
    timeZone: TZ, hour: "2-digit", minute: "2-digit",
  });

export const formatDay = (day: string) =>
  new Date(`${day}T00:00:00+07:00`).toLocaleDateString("id-ID", {
    timeZone: TZ, weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

export const formatWeekday = (day: string) =>
  new Date(`${day}T00:00:00+07:00`).toLocaleDateString("id-ID", { timeZone: TZ, weekday: "short" });

// Pola pencarian LIKE yang aman dari karakter khusus
export const likePattern = (q?: string) => `%${(q ?? "").trim().replace(/[\\%_]/g, "\\$&")}%`;