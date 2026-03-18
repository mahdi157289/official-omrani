'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from './add-to-cart-button';
import { Eye, Ear, ShoppingCart } from 'lucide-react';

interface PackageCardProps {
    pkg: {
        id: string;
        slug: string;
        nameAr: string;
        nameFr: string;
        nameEn?: string | null;
        descriptionAr?: string;
        descriptionFr?: string;
        descriptionEn?: string | null;
        price: number | string | { toNumber: () => number };
        discountPrice?: number | string | { toNumber: () => number } | null;
        isFeatured?: boolean;
        image: {
            url: string;
            altTextAr?: string | null;
            altTextFr?: string | null;
            altTextEn?: string | null;
        } | null;
        ingredientsAr?: string | null;
        ingredientsFr?: string | null;
    };
    locale: string;
}

export function PackageCard({ pkg, locale }: PackageCardProps) {
    const name = locale === 'ar' ? pkg.nameAr : locale === 'fr' ? pkg.nameFr : pkg.nameEn || pkg.nameFr;
    const description = locale === 'ar' ? pkg.descriptionAr : locale === 'fr' ? pkg.descriptionFr : pkg.descriptionEn || pkg.descriptionFr;
    const image = pkg.image?.url || '/placeholder.jpg';

    const price = typeof pkg.price === 'object' ? pkg.price.toNumber() : Number(pkg.price);
    const discountPrice = pkg.discountPrice ? (typeof pkg.discountPrice === 'object' ? pkg.discountPrice.toNumber() : Number(pkg.discountPrice)) : null;

    const ingredients = locale === 'ar' ? (pkg.ingredientsAr || pkg.ingredientsFr) : (pkg.ingredientsFr || pkg.ingredientsAr);

    return (
        <div className="bg-[#F2C782] rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 gold-border flex flex-col h-full">
            <div className="relative h-64 overflow-hidden bg-gray-50">
                <Link href={`/${locale}/packages/${pkg.slug}`} className="relative block w-full h-full">
                    {pkg.image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">
                                {locale === 'ar' ? 'لا توجد صورة' : locale === 'fr' ? 'Pas d\'image' : 'No Image'}
                            </span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </Link>

                {/* Action Buttons */}
                <div className="absolute top-0 right-0 h-full w-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 pointer-events-none group-hover:pointer-events-auto">
                    <div className="flex flex-col gap-3 mr-4">
                        <Link
                            href={`/${locale}/packages/${pkg.slug}`}
                            className="w-11 h-11 rounded-full bg-white text-gray-900 shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                            aria-label="View Details"
                        >
                            <Eye className="w-5 h-5" />
                        </Link>
                        <button
                            type="button"
                            className="w-11 h-11 rounded-full bg-white text-gray-900 shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                        >
                            <Ear className="w-5 h-5" />
                        </button>
                        <AddToCartButton
                            itemId={pkg.id}
                            type="package"
                            locale={locale}
                            compact={true}
                            className="w-11 h-11 rounded-full bg-secondary text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                        />
                    </div>
                </div>

                {pkg.isFeatured && (
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {locale === 'ar' ? 'مميز' : locale === 'fr' ? 'En Vedette' : 'Featured'}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <Link href={`/${locale}/packages/${pkg.slug}`} className="block mb-1 group-hover:text-primary transition-colors">
                    <h3 className="font-bold text-2xl md:text-3xl leading-tight line-clamp-2 min-h-[4rem] text-gray-900 text-center">
                        {name}
                    </h3>
                </Link>

                {/* Separator */}
                <div className="w-16 h-1 bg-[#346977] mx-auto mb-4 rounded-full opacity-60" />

                {description && (
                    <p className="text-lg mb-3 line-clamp-2 text-center leading-relaxed" style={{ color: '#346977' }}>
                        {description}
                    </p>
                )}

                {ingredients && (
                    <p className="text-sm font-semibold text-primary mb-4 line-clamp-2 text-center">
                        {ingredients.split('\n').filter(l => l.trim()).join(' • ')}
                    </p>
                )}

                <div className="mt-auto pt-4 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-4">
                        {discountPrice ? (
                            <>
                                <span className="text-gray-400 line-through text-lg">{formatPrice(price)}</span>
                                <span className="text-3xl font-bold text-primary">{formatPrice(discountPrice)}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
                        )}
                    </div>

                    <AddToCartButton
                        itemId={pkg.id}
                        type="package"
                        locale={locale}
                        className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}
