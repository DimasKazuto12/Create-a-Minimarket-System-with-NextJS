import { PageHeader } from "@/components/ui/PageHeader";
import { CartView } from "./CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader title="Keranjang" description="Periksa pesananmu sebelum dikirim ke toko." />
      <CartView />
    </div>
  );
}