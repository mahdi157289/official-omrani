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
                                    className={`px-4 py-2 border rounded-lg transition-all text-left min-w-[120px] shadow-sm ${isActive
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 text-white shadow-[#D4AF37]/20 scale-105'
                                        : 'glass-card-effect border-white/10 text-white hover:border-white/30 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="text-sm font-bold">{variantName}</div>
                                    <div className={`text-xs ${isActive ? 'text-white' : 'text-white/60'}`}>
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
