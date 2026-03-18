'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/pricing';
import { AddToCartButton } from './add-to-cart-button';

interface Variant {
    id: string;
    nameAr: string;
    nameFr: string;
    priceModifier: number | string | any;
    weight: string;
}

interface ProductSelectionProps {
    product: {
        id: string;
        basePrice: number | string | any;
        variants: Variant[];
    };
    locale: string;
    t: {
        selectWeight: string;
        addToCart: string;
    };
}

export function ProductSelection({ product, locale, t }: ProductSelectionProps) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
        product.variants.length > 0 ? product.variants[0].id : undefined
    );

    const basePrice = Number(product.basePrice);

    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    const currentPrice = selectedVariant
        ? basePrice + Number(selectedVariant.priceModifier)
        : basePrice;

    return (
        <div className="space-y-6">
            <div>
                <p className="text-3xl font-bold text-white mb-4">
                    {formatPrice(currentPrice)}
                </p>
            </div>

            {product.variants.length > 0 && (
                <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                        {t.selectWeight}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => {
                            const variantName = locale === 'ar' ? variant.nameAr : variant.nameFr;
                            const totalPrice = basePrice + Number(variant.priceModifier);
                            const isActive = selectedVariantId === variant.id;

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariantId(variant.id)}
                                    className={`px-4 py-2 border-2 rounded-lg transition-all text-left min-w-[120px] ${isActive
                                        ? 'border-secondary bg-secondary text-white shadow-lg scale-105'
                                        : 'border-primary/30 text-white hover:border-primary/60 hover:bg-white/5'
                                        }`}
                                >
                                    <div className="text-sm font-bold">{variantName}</div>
                                    <div className={`text-xs ${isActive ? 'text-white/80' : 'text-primary'}`}>
                                        {formatPrice(totalPrice)}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton
                productId={product.id}
                variantId={selectedVariantId}
                locale={locale}
                className="mt-4"
            />
        </div>
    );
}
