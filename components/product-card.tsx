'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { AddToCartButton } from './add-to-cart-button';
import { Eye, Ear, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    nameAr: string;
    nameFr: string;
    nameEn?: string | null;
    descriptionAr?: string;
    descriptionFr?: string;
    descriptionEn?: string | null;
    ingredientsAr?: string | null;
    ingredientsFr?: string | null;
    basePrice: number | string | { toNumber: () => number };
    isNew?: boolean;
    isFeatured?: boolean;
    stockQuantity?: number;
    images: Array<{
      url: string;
      altTextAr?: string | null;
      altTextFr?: string | null;
      altTextEn?: string | null;
    }>;
    category: {
      nameAr: string;
      nameFr: string;
      nameEn?: string | null;
    };
  };
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations('product');
  const name = locale === 'ar'
    ? product.nameAr
    : locale === 'fr'
      ? product.nameFr
      : product.nameEn || product.nameFr;

  const image = product.images[0]?.url || '/placeholder.jpg';
  const altText = locale === 'ar'
    ? product.images[0]?.altTextAr
    : locale === 'fr'
      ? product.images[0]?.altTextFr
      : product.images[0]?.altTextEn || product.nameFr;

  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;
  const description = locale === 'ar'
    ? product.descriptionAr
    : locale === 'fr'
      ? product.descriptionFr
      : product.descriptionEn || product.descriptionFr;
  const ingredients = locale === 'ar'
    ? product.ingredientsAr
    : product.ingredientsFr;

  return (
    <div className="bg-[#F2C782] rounded-2xl shadow-lg overflow-hidden group flex flex-col h-full gold-border">
      <div className="relative w-full h-64 overflow-hidden bg-gray-50">
        <Link href={`/${locale}/shop/${product.slug}`} className="relative block w-full h-full">
          {product.images[0] ? (
            <Image
              src={image}
              alt={altText || name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">
                {t('noImage')}
              </span>
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </Link>

        <div className="absolute top-0 right-0 h-full w-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 pointer-events-none group-hover:pointer-events-auto">
          <div className="flex flex-col gap-3 mr-4">
            <Link
              href={`/${locale}/shop/${product.slug}`}
              className="w-11 h-11 rounded-full bg-white text-gray-900 shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label={t('viewDetails')}
            >
              <Eye className="w-5 h-5" />
            </Link>
            <button
              type="button"
              className="w-11 h-11 rounded-full bg-white text-gray-900 shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label="Hear Product"
            >
              <Ear className="w-5 h-5" />
            </button>
            {!isOutOfStock ? (
              <AddToCartButton
                productId={product.id}
                locale={locale}
                compact={true}
                className="w-11 h-11 rounded-full bg-secondary text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
              />
            ) : (
              <button
                disabled
                className="w-11 h-11 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center cursor-not-allowed"
                aria-label="Unavailable"
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full shadow-md">
              {t('new')}
            </span>
          )}
          {product.isFeatured && (
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-md">
              {t('featured')}
            </span>
          )}
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg shadow-lg transform -rotate-12 border-2 border-white">
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Category section removed */}

        <Link href={`/${locale}/shop/${product.slug}`} className="block mb-1 group-hover:text-primary transition-colors">
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
          <p className="text-lg text-black mb-4 line-clamp-2 text-center">
            {ingredients}
          </p>
        )}
        <p className="text-3xl font-bold text-primary mt-auto mb-4 text-center">
          {formatPrice(product.basePrice)}
        </p>

        <div className="pt-4 border-t border-gray-100">
          {!isOutOfStock ? (
            <AddToCartButton
              productId={product.id}
              locale={locale}
              className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary transition-colors"
            />
          ) : (
            <button
              disabled
              className="w-full py-2 rounded-lg bg-gray-200 text-gray-400 cursor-not-allowed"
            >
              {t('unavailable')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
