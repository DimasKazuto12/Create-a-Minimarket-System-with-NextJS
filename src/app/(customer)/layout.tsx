import { Suspense } from "react";
import CustomerShell from "@/components/customer/CustomerShell";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-stone-50" />}>
      <CustomerShell>{children}</CustomerShell>
    </Suspense>
  );
}