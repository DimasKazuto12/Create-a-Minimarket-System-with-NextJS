import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";
import { CartView } from "./CartView";

export default async function CartPage() {
  await requireRole("CUSTOMER");
  return (
    <>
      <PageHeader title="Keranjang" description="Periksa pesananmu sebelum dikirim ke toko." />
      <CartView />
    </>
  );
}