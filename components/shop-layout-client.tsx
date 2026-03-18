'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopLayoutClientProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    locale: string;
}

export function ShopLayoutClient({ children, sidebar, locale }: ShopLayoutClientProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="relative">
            {/* Floating Toggle Button - Right Side (Higher to avoid Translation overlap) */}
            <div className="fixed bottom-[320px] right-6 z-50">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group border-2 ${showFilters
                        ? 'bg-secondary border-secondary text-white shadow-[0_0_15px_rgba(231,193,95,0.4)]'
                        : 'bg-[#F2C782] border-secondary text-gray-900 shadow-lg'
                        }`}
                    aria-label="Toggle Filters"
                >
                    {showFilters ? (
                        <X className="w-6 h-6 animate-in spin-in-90 duration-300" />
                    ) : (
                        <SlidersHorizontal className="w-6 h-6" />
                    )}

                    <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                        {locale === 'ar' ? 'تصفية المنتجات' : locale === 'fr' ? 'Filtrer' : 'Filter Products'}
                    </span>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar with Sticky positioning for Desktop */}
                <aside
                    className={`
            fixed inset-0 z-40 bg-black/50 backdrop-blur-sm 
            md:sticky md:top-32 md:z-30 md:bg-transparent md:backdrop-blur-none 
            transition-all duration-300 md:self-start md:h-fit
            ${showFilters ? 'opacity-100 pointer-events-auto md:translate-x-0' : 'opacity-0 pointer-events-none -translate-x-full md:translate-x-0'}
            ${showFilters ? 'md:w-72 lg:w-80 md:opacity-100 md:pointer-events-auto' : 'md:w-0 md:overflow-hidden md:opacity-0 md:pointer-events-none'}
          `}
                    onClick={() => setShowFilters(false)}
                >
                    <div
                        className={`
              absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-background p-4 overflow-y-auto transition-transform duration-300 ease-out md:relative md:w-full md:max-w-none md:bg-transparent md:p-0 md:transform-none
            `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {sidebar}
                    </div>
                </aside>

                {/* Product Grid Area */}
                <div className="flex-grow transition-all duration-300">
                    {children}
                </div>
            </div>
        </div>
    );
}
