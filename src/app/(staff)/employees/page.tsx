import { Suspense } from "react";
import { EmployeesContent } from "./employees-content";

type Props = {
  searchParams: Promise<{ tampil?: string }>;
};

function EmployeesSkeleton() {
  return <div className="h-64 rounded-3xl bg-stone-200 animate-pulse" />;
}

export default function EmployeesPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<EmployeesSkeleton />}>
      <EmployeesContent searchParams={searchParams} />
    </Suspense>
  );
}