'use client';

import { ShopSkeleton } from '@/components/ui/skeletons';

export default function ShopLoading() {
    return (
        <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
            <ShopSkeleton />
        </div>
    );
}
