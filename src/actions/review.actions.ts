"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";

const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1, "Pilih bintang dulu").max(5),
  comment: z.string().trim().min(3, "Komentar minimal 3 karakter").max(500, "Komentar maksimal 500 karakter"),
});

export async function createReviewAction(productId: string, rating: number, comment: string) {
  const session = await requireRole("CUSTOMER");

  const parsed = reviewSchema.safeParse({ productId, rating, comment });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const product = await db.orm.public.Product.first({ id: productId, isActive: true });
  if (!product) return { error: "Barang tidak ditemukan" };

  const key = { productId, userId: session.userId };
  const existing = await db.orm.public.Review.whereUnique(key).first();

  if (existing) {
    await db.orm.public.Review.whereUnique(key).update({
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    });
  } else {
    await db.orm.public.Review.create({ ...key, rating: parsed.data.rating, comment: parsed.data.comment });
  }

  revalidatePath(`/products/${productId}`);
  return { ok: true as const };
}