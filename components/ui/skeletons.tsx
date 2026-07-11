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
        // Hide skeleton after 0.5s to ensure a fast, "zero-wait" perceived experience
        const timer = setTimeout(() => {
            setVisible(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (!visible) {
        return null;
    }

    return (
        <div className="bg-gold/10 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col h-full overflow-hidden gold-border transition-all duration-300">
            {/* Image Skeleton */}
            <div className="w-full h-64 bg-white/10 animate-pulse relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>

            <div className="p-5 flex flex-col items-center flex-grow space-y-4">
                {/* Title Skeleton */}
                <div className="h-8 w-3/4 bg-white/20 rounded-md animate-pulse" />

                {/* Separator Skeleton */}
                <div className="w-16 h-1 bg-[#346977]/30 mx-auto mb-2 rounded-full" />

                {/* Description Skeleton */}
                <div className="w-full space-y-2 mt-2">
                    <div className="h-4 w-full bg-white/15 rounded-md animate-pulse mx-auto" />
                    <div className="h-4 w-5/6 bg-white/15 rounded-md animate-pulse mx-auto" />
                </div>

                {/* Price Skeleton */}
                <div className="h-8 w-1/3 mt-auto bg-primary/20 rounded-md animate-pulse" />

                {/* Button Skeleton */}
                <div className="h-10 w-full bg-secondary/30 rounded-lg animate-pulse" />
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
