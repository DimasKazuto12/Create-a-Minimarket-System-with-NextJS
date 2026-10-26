"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";

const roleSchema = z.enum(["CUSTOMER", "CASHIER", "INVENTORY_ADMIN", "SUPER_ADMIN"]);

export async function changeRoleAction(userId: string, newRole: string) {
  const session = await requireRole("SUPER_ADMIN");
  const role = roleSchema.safeParse(newRole);
  if (!role.success) return { error: "Role tidak valid" };
  if (userId === session.userId) return { error: "Tidak bisa mengubah role akun sendiri" };

  await db.orm.public.User.where({ id: userId }).update({ role: role.data });
  revalidatePath("/employees");
  return { ok: true };
}

export async function toggleActiveAction(userId: string) {
  const session = await requireRole("SUPER_ADMIN");
  if (userId === session.userId) return { error: "Tidak bisa menonaktifkan akun sendiri" };

  const user = await db.orm.public.User.firstOrThrow({ id: userId });
  await db.orm.public.User.where({ id: userId }).update({ isActive: !user.isActive });
  revalidatePath("/employees");
  return { ok: true };
}