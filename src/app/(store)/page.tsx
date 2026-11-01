import { Suspense } from "react";
import { HomeContent } from "./home-content";

function HomeSkeleton() {
  return <div className="h-64 rounded-3xl bg-stone-200 animate-pulse" />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}