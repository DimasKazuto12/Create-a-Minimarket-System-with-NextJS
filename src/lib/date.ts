import "temporal-polyfill/full/global";
import "temporal-polyfill/types/global";

const WIB_MS = 7 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Tanggal WIB "2026-10-25" dari epoch milidetik
export function dayWIB(epochMs: number) {
  return new Date(epochMs + WIB_MS).toISOString().slice(0, 10);
}
export function todayWIB() {
  return dayWIB(Date.now());
}
export function daysAgoWIB(n: number) {
  return dayWIB(Date.now() - n * DAY_MS);
}
// Awal hari WIB, n hari lalu, sebagai Temporal.Instant (untuk filter DateTime)
export function startOfDayWIB(n = 0) {
  return Temporal.Instant.from(`${daysAgoWIB(n)}T00:00:00+07:00`);
}