"use server";

import "temporal-polyfill/full/global";
import { revalidatePath } from "next/cache";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";
import { todayWIB } from "@/lib/date";

export async function clockInAction() {
  const s = await requireRole("CASHIER", "INVENTORY_ADMIN", "SUPER_ADMIN");
  const day = todayWIB();

  const existing = await db.orm.public.Attendance.whereUnique({ userId: s.userId, day }).first();
  if (existing) return { error: "Kamu sudah absen masuk hari ini" };

  await db.orm.public.Attendance.create({ userId: s.userId, day }); // clockIn otomatis now()
  revalidatePath("/attendance");
  return { ok: true };
}

export async function clockOutAction() {
  const s = await requireRole("CASHIER", "INVENTORY_ADMIN", "SUPER_ADMIN");
  const day = todayWIB();

  const row = await db.orm.public.Attendance.whereUnique({ userId: s.userId, day }).first();
  if (!row) return { error: "Belum absen masuk" };
  if (row.clockOut) return { error: "Sudah absen pulang" };

  await db.orm.public.Attendance
    .whereUnique({ userId: s.userId, day })
    .update({ clockOut: Temporal.Now.instant() });

  revalidatePath("/attendance");
  return { ok: true };
}