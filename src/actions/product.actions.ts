"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";

const productSchema = z.object({
  barcode: z.string().min(3, "Barcode minimal 3 karakter"),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  price: z.coerce.number().int().min(1, "Harga harus lebih dari 0"),
  stock: z.coerce.number().int().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(5),
});

export async function createProductAction(formData: FormData) {
  const session = await requireRole("INVENTORY_ADMIN", "SUPER_ADMIN");
  const parsed = productSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const exists = await db.orm.public.Product.first({ barcode: parsed.data.barcode });
  if (exists) return { error: "Barcode sudah dipakai barang lain" };

  const { stock, ...data } = parsed.data;
  await db.transaction(async (tx) => {
    const p = await tx.orm.public.Product.create({ ...data, stock });
    if (stock > 0) {
      await tx.orm.public.StockMovement.create({
        productId: p.id,
        type: "IN",
        qty: stock,
        note: "Stok awal",
        userId: session.userId,
      });
    }
  });

  revalidatePath("/inventory");
  return { ok: true };
}

export async function addStockAction(productId: string, qty: number, note?: string) {
  const session = await requireRole("INVENTORY_ADMIN", "SUPER_ADMIN");
  if (!Number.isInteger(qty) || qty < 1) return { error: "Jumlah tidak valid" };

  try {
    await db.transaction(async (tx) => {
      const p = await tx.orm.public.Product.where({ id: productId }).forUpdate().first();
      if (!p) throw new Error("Barang tidak ditemukan");

      await tx.orm.public.Product.where({ id: productId }).update({ stock: p.stock + qty });
      await tx.orm.public.StockMovement.create({
        productId,
        type: "IN",
        qty,
        note: note ?? null,
        userId: session.userId,
      });
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal menambah stok" };
  }

  revalidatePath("/inventory");
  return { ok: true };
}

// "Hapus" = nonaktifkan, supaya riwayat transaksi tidak rusak
export async function deleteProductAction(productId: string) {
  await requireRole("INVENTORY_ADMIN", "SUPER_ADMIN");
  await db.orm.public.Product.where({ id: productId }).update({ isActive: false });
  revalidatePath("/inventory");
  return { ok: true };
}