'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

interface Category {
    id: string;
    slug: string;
    nameAr: string;
    nameFr: string;
    nameEn?: string;
}

interface ShopFiltersProps {
    categories: Category[];
    locale: string;
}

export function ShopFilters({ categories, locale }: ShopFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const currentCategory = searchParams.get('category') || '';
    const currentType = searchParams.get('type') || '';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handlePriceApply = () => {
        let params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set('minPrice', minPrice);
        else params.delete('minPrice');

        if (maxPrice) params.set('maxPrice', maxPrice);
        else params.delete('maxPrice');

        router.push(`${pathname}?${params.toString()}`);
    };

    const getCategoryName = (cat: Category) => {
        switch (locale) {
            case 'fr': return cat.nameFr;
            case 'ar': return cat.nameAr;
            default: return cat.nameEn || cat.nameFr;
        }
    };

    return (
        <div className="bg-[#F2C782] p-6 rounded-2xl shadow-lg gold-border mb-8 space-y-8 h-fit">
            <div className="pb-6 border-b border-black/10">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {locale === 'ar' ? 'النوع' : locale === 'fr' ? 'Type' : 'Type'}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => router.push(`${pathname}?${createQueryString('type', '')}`)}
                        className={`flex-1 px-4 py-2 rounded-full border-2 transition-all duration-300 font-medium text-center ${!currentType
                            ? 'bg-secondary text-white border-secondary shadow-md'
                            : 'bg-white/50 text-gray-700 border-transparent hover:bg-white hover:border-secondary/50'
                            }`}
                    >
                        {locale === 'ar' ? 'الكل' : locale === 'fr' ? 'Tout' : 'All'}
                    </button>
                    <button
                        onClick={() => router.push(`${pathname}?${createQueryString('type', 'product')}`)}
                        className={`flex-1 px-4 py-2 rounded-full border-2 transition-all duration-300 font-medium text-center ${currentType === 'product'
                            ? 'bg-secondary text-white border-secondary shadow-md'
                            : 'bg-white/50 text-gray-700 border-transparent hover:bg-white hover:border-secondary/50'
                            }`}
                    >
                        {locale === 'ar' ? 'منتجات' : locale === 'fr' ? 'Produits' : 'Products'}
                    </button>
                    <button
                        onClick={() => router.push(`${pathname}?${createQueryString('type', 'package')}`)}
                        className={`flex-1 px-4 py-2 rounded-full border-2 transition-all duration-300 font-medium text-center ${currentType === 'package'
                            ? 'bg-secondary text-white border-secondary shadow-md'
                            : 'bg-white/50 text-gray-700 border-transparent hover:bg-white hover:border-secondary/50'
                            }`}
                    >
                        {locale === 'ar' ? 'باقات' : locale === 'fr' ? 'Packs' : 'Packs'}
                    </button>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {locale === 'ar' ? 'الأصناف' : locale === 'fr' ? 'Catégories' : 'Categories'}
                </h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => router.push(`${pathname}?${createQueryString('category', '')}`)}
                        className={`px-4 py-2 rounded-full border-2 transition-all duration-300 font-medium ${!currentCategory
                            ? 'bg-secondary text-white border-secondary shadow-md'
                            : 'bg-white/50 text-gray-700 border-transparent hover:bg-white hover:border-secondary/50'
                            }`}
                    >
                        {locale === 'ar' ? 'الكل' : locale === 'fr' ? 'Tout' : 'All'}
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => router.push(`${pathname}?${createQueryString('category', cat.slug)}`)}
                            className={`px-4 py-2 rounded-full border-2 transition-all duration-300 font-medium ${currentCategory === cat.slug
                                ? 'bg-secondary text-white border-secondary shadow-md'
                                : 'bg-white/50 text-gray-700 border-transparent hover:bg-white hover:border-secondary/50'
                                }`}
                        >
                            {getCategoryName(cat)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-black/10">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {locale === 'ar' ? 'نطاق السعر' : locale === 'fr' ? 'Prix (TND)' : 'Price Range (TND)'}
                </h3>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            placeholder={locale === 'ar' ? 'الأدنى' : 'Min'}
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-transparent rounded-lg focus:outline-none focus:border-secondary transition-all text-black font-bold"
                        />
                        <span className="text-gray-900 font-bold">-</span>
                        <input
                            type="number"
                            placeholder={locale === 'ar' ? 'الأقصى' : 'Max'}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-transparent rounded-lg focus:outline-none focus:border-secondary transition-all text-black font-bold"
                        />
                    </div>
                    <button
                        onClick={handlePriceApply}
                        className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary shadow-md hover:shadow-lg transition-all font-bold"
                    >
                        {locale === 'ar' ? 'تطبيق' : locale === 'fr' ? 'Appliquer' : 'Apply'}
                    </button>
                </div>
            </div>
        </div>
    );
}
