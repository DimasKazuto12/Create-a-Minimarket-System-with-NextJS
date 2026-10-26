import { Suspense } from "react";
import StaffShell from "@/components/layout/StaffShell";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-stone-50" />}>
      <StaffShell>{children}</StaffShell>
    </Suspense>
  );
}