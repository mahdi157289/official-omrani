'use client';

import { useEffect, useState } from 'react';

export function Skeleton({ className }: { className?: string }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Hide skeleton after 0.5s
        const timer = setTimeout(() => {
            setVisible(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className={`animate-pulse bg-gray-200/50 rounded ${className}`} />
    );
}

export function ProductSkeleton() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Hide skeleton after 0.5s
        const timer = setTimeout(() => {
            setVisible(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className="bg-[#F2C782]/40 rounded-2xl shadow-lg border border-[#D4AF37]/20 flex flex-col h-full overflow-hidden">
            {/* Image Skeleton */}
            <Skeleton className="w-full h-64 rounded-none" />

            <div className="p-5 flex flex-col items-center flex-grow space-y-4">
                {/* Title Skeleton */}
                <Skeleton className="h-8 w-3/4" />

                {/* Description Skeleton */}
                <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Ingredients Skeleton */}
                <Skeleton className="h-4 w-1/2" />

                {/* Price Skeleton */}
                <Skeleton className="h-8 w-1/3 mt-auto" />

                {/* Button Skeleton */}
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
}

export function ShopSkeleton() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Hide skeleton after 0.5s
        const timer = setTimeout(() => {
            setVisible(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start opacity-50">
            {/* Sidebar Skeleton */}
            <div className="hidden md:block w-72 lg:w-80 h-[600px] bg-gray-100/30 rounded-2xl blur-sm" />

            {/* Grid Skeleton */}
            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <ProductSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
