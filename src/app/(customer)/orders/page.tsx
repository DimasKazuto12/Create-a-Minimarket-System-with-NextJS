import { Suspense } from "react";
import { OrdersContent } from "./orders-content";

function ShopSkeleton() {
    return <div className="h-64 rounded-3xl bg-stone-200 animate-pulse" />;
}

export default function ShopPage() {
    return (
        <Suspense fallback={<ShopSkeleton />}>
            <OrdersContent />
        </Suspense>
    );
}