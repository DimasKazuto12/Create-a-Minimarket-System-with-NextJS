import { db } from "@/prisma/db";
import { withRetry } from "@/lib/retry";

type OrderChannel = "POS" | "ONLINE";
type PaymentMethod = "CASH" | "QRIS" | "TRANSFER";

type CreateOrderInput = {
  channel: OrderChannel;
  items: { productId: string; qty: number }[];
  customerId?: string;
  cashierId?: string;
  paymentMethod?: PaymentMethod;
};

function generateOrderCode() {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `INV-${d}-${rand}`;
}

export async function createOrder(input: CreateOrderInput) {
  if (input.items.length === 0) throw new Error("Keranjang kosong");

  // Gabungkan barang yang sama supaya tidak terhitung dua kali
  const wanted = new Map<string, number>();
  for (const i of input.items) {
    if (!Number.isInteger(i.qty) || i.qty < 1) throw new Error("Jumlah tidak valid");
    wanted.set(i.productId, (wanted.get(i.productId) ?? 0) + i.qty);
  }
  const ids = [...wanted.keys()];
  const actorId = input.cashierId ?? input.customerId ?? null;

  return withRetry(() =>
    db.transaction(async (tx) => {
      // Kunci baris barang (urut berdasarkan id agar tidak deadlock)
      const products = await tx.orm.public.Product
        .where((p) => p.id.in(ids))
        .where({ isActive: true })
        .orderBy((p) => p.id.asc())
        .forUpdate()
        .all();

      if (products.length !== ids.length) throw new Error("Ada barang yang tidak tersedia");

      let total = 0;
      const lines = products.map((p) => {
        const qty = wanted.get(p.id)!;
        if (p.stock < qty) throw new Error(`Stok "${p.name}" tidak cukup`);
        const subtotal = p.price * qty; // harga dari database, bukan dari browser
        total += subtotal;
        return { productId: p.id, qty, unitPrice: p.price, subtotal, newStock: p.stock - qty };
      });

      for (const l of lines) {
        await tx.orm.public.Product.where({ id: l.productId }).update({ stock: l.newStock });
        await tx.orm.public.StockMovement.create({
          productId: l.productId,
          type: "SALE",
          qty: l.qty,
          note: "Penjualan",
          userId: actorId,
        });
      }

      const order = await tx.orm.public.Order.create({
        code: generateOrderCode(),
        channel: input.channel,
        status: input.channel === "POS" ? "COMPLETED" : "PENDING",
        paymentMethod: input.paymentMethod ?? null,
        total,
        customerId: input.customerId ?? null,
        cashierId: input.cashierId ?? null,
        items: (items) =>
          items.create(
            lines.map(({ productId, qty, unitPrice, subtotal }) => ({
              productId,
              qty,
              unitPrice,
              subtotal,
            }))
          ),
      });

      return { code: order.code, total: order.total };
    })
  );
}