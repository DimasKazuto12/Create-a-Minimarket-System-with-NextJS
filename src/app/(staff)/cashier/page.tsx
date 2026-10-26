import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/ui/PageHeader";
import CashierClient from "./CashierClient";

export default async function CashierPage() {
  await requireRole("CASHIER", "SUPER_ADMIN");
  return (
    <>
      <PageHeader title="Kasir" description="Scan barcode lewat kamera atau ketik manual." />
      <CashierClient />
    </>
  );
}