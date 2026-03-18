'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/components/providers/cart-provider';

interface AddToCartButtonProps {
  productId?: string;
  itemId?: string;
  type?: 'product' | 'package';
  locale: string;
  variantId?: string;
  quantity?: number;
  className?: string;
  compact?: boolean;
}

export function AddToCartButton({ 
  productId,
  itemId,
  type = 'product',
  locale,
  variantId,
  quantity = 1,
  className = '',
  compact = false
}: AddToCartButtonProps) {
  const t = useTranslations('product');
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const id = itemId || productId;
  if (!id) return null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if inside a link
    setIsAdding(true);
    
    try {
      const success = await addToCart(id, quantity, variantId, type);

      if (success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(locale === 'ar' ? 'فشل إضافة المنتج إلى السلة' : locale === 'fr' ? 'Échec de l\'ajout au panier' : 'Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding || added}
        className={`p-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110 gold-border glare-effect ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-primary text-white hover:bg-primary-dark'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title={t('addToCart')}
      >
        {added ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : isAdding ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || added}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors gold-border glare-effect ${
        added
          ? 'bg-green-600 text-white'
          : 'bg-primary text-white hover:bg-primary-dark'
      } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAdding 
        ? (locale === 'ar' ? 'جاري الإضافة...' : locale === 'fr' ? 'Ajout en cours...' : 'Adding...')
        : added
        ? (locale === 'ar' ? 'تمت الإضافة!' : locale === 'fr' ? 'Ajouté!' : 'Added!')
        : t('addToCart')
      }
    </button>
  );
}


