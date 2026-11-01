"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/customer/CartProvider";
import { useAuth } from "./AuthModal";

type Props = { product: { id: string; name: string; price: number; stock: number } };

export function BuyNowButton({ product }: Props) {
  const { lines, add } = useCart();
  const { user, openLogin } = useAuth();
  const router = useRouter();

  function buyNow() {
    if (!lines.some((l) => l.productId === product.id)) {
      add({ productId: product.id, name: product.name, price: product.price, stock: product.stock });
    }
    if (!user) return openLogin("Masuk untuk melanjutkan pesananmu. Barang sudah masuk keranjang.", "/cart");
    router.push("/cart");
  }

  return (
    <button
      onClick={buyNow}
      disabled={product.stock === 0}
      className="flex-1 rounded-2xl bg-accent px-6 py-3.5 font-semibold text-white transition hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
    >
      Pesan sekarang
    </button>
  );
}