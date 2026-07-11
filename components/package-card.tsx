'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/providers/cart-provider';
import { AddToCartButton } from './add-to-cart-button';
import { Eye, Ear, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
        recipeIngredientsAr?: string | null;
        recipeIngredientsFr?: string | null;
        recipeIngredientsEn?: string | null;
    };
    locale: string;
}

export function PackageCard({ pkg, locale }: PackageCardProps) {
    const { formatPrice } = useCart();
    const t = useTranslations('admin');
    const name = locale === 'ar' ? pkg.nameAr : locale === 'fr' ? pkg.nameFr : pkg.nameEn || pkg.nameFr;
    const description = locale === 'ar' ? pkg.descriptionAr : locale === 'fr' ? pkg.descriptionFr : pkg.descriptionEn || pkg.descriptionFr;
    const image = pkg.image?.url || '/placeholder.jpg';

    const price = typeof pkg.price === 'object' ? pkg.price.toNumber() : Number(pkg.price);
    const discountPrice = pkg.discountPrice ? (typeof pkg.discountPrice === 'object' ? pkg.discountPrice.toNumber() : Number(pkg.discountPrice)) : null;

    const recipeIngredients = locale === 'ar' ? (pkg.recipeIngredientsAr || pkg.recipeIngredientsFr) : (pkg.recipeIngredientsFr || pkg.recipeIngredientsAr);

    return (
        <div className="glass-card-effect rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 gold-border flex flex-col h-full">
            <div className="relative h-64 overflow-hidden bg-white/5">
                <Link href={`/${locale}/packages/${pkg.slug}`} className="relative block w-full h-full">
                    {pkg.image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
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
                <div className="absolute top-0 right-0 h-full w-16 md:w-20 flex items-center justify-center translate-x-0 lg:translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-40 pointer-events-auto">
                    <div className="flex flex-col gap-2 md:gap-3 mr-2 md:mr-4">
                        <Link
                            href={`/${locale}/packages/${pkg.slug}`}
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-md text-white shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90 border border-white/20"
                            aria-label="View Details"
                        >
                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                        <button
                            type="button"
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-md text-white shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90 border border-white/20"
                        >
                            <Ear className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <AddToCartButton
                            itemId={pkg.id}
                            type="package"
                            locale={locale}
                            compact={true}
                            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-secondary text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
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
                    <h3 className="font-bold text-2xl md:text-3xl leading-tight line-clamp-2 min-h-[4rem] text-white text-center">
                        {name}
                    </h3>
                </Link>

                {/* Separator */}
                <div className="w-16 h-1 bg-[#346977] mx-auto mb-4 rounded-full opacity-60" />

                {description && (
                    <p className="text-lg mb-3 line-clamp-2 text-center leading-relaxed text-white/80">
                        {description}
                    </p>
                )}

                {recipeIngredients && (
                    <div className="mb-4 text-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary opacity-90 block mb-1">
                            {t('recipeIngredients')}
                        </span>
                        <p className="text-sm font-semibold text-white/90 line-clamp-2">
                            {recipeIngredients.split('\n').filter(l => l.trim()).join(' • ')}
                        </p>
                    </div>
                )}

                <div className="mt-auto pt-4 flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-4">
                        {discountPrice ? (
                            <>
                                <span className="text-gray-400 line-through text-lg">{formatPrice(price)}</span>
                                <span className="text-3xl font-bold text-gold">{formatPrice(discountPrice)}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-gold">{formatPrice(price)}</span>
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
