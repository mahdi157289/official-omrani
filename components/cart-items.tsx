'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId?: string;
  packageId?: string;
  type?: 'product' | 'package';
  productSlug: string;
  productName: string;
  productImage?: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  total: number;
}

export function CartItems({ locale }: { locale: string }) {
  const t = useTranslations('common');
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart?locale=${locale}&sessionId=default`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.cart);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [locale]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    // Optimistic update
    setItems(items.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));

    try {
      await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: 'default',
          itemId,
          quantity: newQuantity,
        }),
      });
      // Optionally refetch to be sure
      // fetchCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert optimistic update? For now just log.
    }
  };

  const removeItem = async (itemId: string) => {
    // Optimistic update
    setItems(items.filter(item => item.id !== itemId));

    try {
      await fetch(`/api/cart?sessionId=default&itemId=${itemId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = 0; // TODO: Calculate based on delivery zone
  const total = subtotal + deliveryFee;

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary">
          {locale === 'ar' ? 'جاري التحميل...' : locale === 'fr' ? 'Chargement...' : 'Loading...'}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary text-lg mb-4">
          {locale === 'ar' 
            ? 'سلة التسوق فارغة' 
            : locale === 'fr'
            ? 'Votre panier est vide'
            : 'Your cart is empty'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors mt-4"
        >
          {locale === 'ar' ? 'تسوق الآن' : locale === 'fr' ? 'Acheter maintenant' : 'Shop Now'}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
            {item.productImage && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <Link href={item.type === 'package' ? `/${locale}/packages` : `/${locale}/shop/${item.productSlug}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                  {item.productName}
                </h3>
              </Link>
              {item.variantName && (
                <p className="text-sm text-text-secondary mt-1">{item.variantName}</p>
              )}
              <p className="text-primary font-bold mt-2">{formatPrice(item.price)}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{formatPrice(item.total)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-4">
            {locale === 'ar' ? 'ملخص الطلب' : locale === 'fr' ? 'Résumé de la commande' : 'Order Summary'}
          </h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {locale === 'ar' ? 'المجموع الفرعي' : locale === 'fr' ? 'Sous-total' : 'Subtotal'}
              </span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">
                {locale === 'ar' ? 'رسوم التوصيل' : locale === 'fr' ? 'Frais de livraison' : 'Delivery Fee'}
              </span>
              <span className="font-semibold">
                {deliveryFee === 0 
                  ? (locale === 'ar' ? 'مجاناً' : locale === 'fr' ? 'Gratuit' : 'Free')
                  : formatPrice(deliveryFee)
                }
              </span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>
                {locale === 'ar' ? 'الإجمالي' : locale === 'fr' ? 'Total' : 'Total'}
              </span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          <Link
            href={`/${locale}/checkout`}
            className="block w-full bg-primary text-white text-center py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            {locale === 'ar' ? 'إتمام الطلب' : locale === 'fr' ? 'Passer la commande' : 'Proceed to Checkout'}
          </Link>
        </div>
      </div>
    </div>
  );
}
