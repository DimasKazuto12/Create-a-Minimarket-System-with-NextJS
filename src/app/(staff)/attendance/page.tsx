import { Suspense } from "react";
import { AttendanceContent } from "./attendance-content";

function AttendanceSkeleton() {
  return <div className="h-64 rounded-3xl bg-stone-200 animate-pulse" />;
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<AttendanceSkeleton />}>
      <AttendanceContent />
    </Suspense>
  );
}