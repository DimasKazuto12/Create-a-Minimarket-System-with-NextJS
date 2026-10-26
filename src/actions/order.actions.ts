"use server";

import { z } from "zod";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";
import { createOrder } from "@/services/order.service";
import { revalidatePath } from "next/cache";
import { withRetry } from "@/lib/retry";

const cartSchema = z.array(
  z.object({ productId: z.string(), qty: z.number().int().min(1).max(999) })
);

export async function findProductByBarcode(barcode: string) {
  await requireRole("CASHIER", "SUPER_ADMIN");
  const product = await db.orm.public.Product
    .where({ barcode, isActive: true })
    .select("id", "name", "price", "stock")
    .first();
  return product; // Row | null
}

export async function checkoutPosAction(
  items: unknown,
  paymentMethod: "CASH" | "QRIS" | "TRANSFER"
) {
  const session = await requireRole("CASHIER", "SUPER_ADMIN");
  const parsed = cartSchema.safeParse(items);
  if (!parsed.success) return { error: "Data keranjang tidak valid" };

  try {
    const order = await createOrder({
      channel: "POS",
      items: parsed.data,
      cashierId: session.userId,
      paymentMethod,
    });
    return { ok: true as const, code: order.code, total: order.total };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal memproses transaksi" };
  }
}

export async function checkoutOnlineAction(items: unknown) {
  const session = await requireRole("CUSTOMER");
  const parsed = cartSchema.safeParse(items);
  if (!parsed.success) return { error: "Data keranjang tidak valid" };

  try {
    const order = await createOrder({
      channel: "ONLINE",
      items: parsed.data,
      customerId: session.userId,
    });
    return { ok: true as const, code: order.code };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal membuat pesanan" };
  }
}

const statusSchema = z.enum(["PAID", "PREPARING", "READY", "COMPLETED", "CANCELLED"]);

export async function updateOrderStatusAction(orderId: string, status: string) {
  const session = await requireRole("CASHIER", "SUPER_ADMIN");
  const parsed = statusSchema.safeParse(status);
  if (!parsed.success) return { error: "Status tidak valid" };

  try {
    await withRetry(() =>
      db.transaction(async (tx) => {
        const order = await tx.orm.public.Order.where({ id: orderId }).forUpdate().first();
        if (!order || order.channel !== "ONLINE") throw new Error("Pesanan tidak ditemukan");
        if (order.status === "COMPLETED" || order.status === "CANCELLED") {
          throw new Error("Pesanan sudah selesai atau dibatalkan");
        }

        // Pembatalan mengembalikan stok
        if (parsed.data === "CANCELLED") {
          const items = await tx.orm.public.OrderItem.where({ orderId }).all();
          for (const it of items) {
            const p = await tx.orm.public.Product.where({ id: it.productId }).forUpdate().first();
            if (!p) continue;
            await tx.orm.public.Product.where({ id: p.id }).update({ stock: p.stock + it.qty });
            await tx.orm.public.StockMovement.create({
              productId: p.id,
              type: "ADJUSTMENT",
              qty: it.qty,
              note: `Pesanan ${order.code} dibatalkan`,
              userId: session.userId,
            });
          }
        }

        await tx.orm.public.Order.where({ id: orderId }).update({ status: parsed.data });
      })
    );
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Gagal mengubah status" };
  }

  revalidatePath("/online-orders");
  return { ok: true };
}