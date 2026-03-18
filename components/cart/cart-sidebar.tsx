'use client';

import { useCart } from '@/components/providers/cart-provider';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { OrderModal } from './order-modal';
import { formatPrice } from '@/lib/utils';

export function CartSidebar({ locale }: { locale: string }) {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, total } = useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handlePurchase = () => {
    setIsOrderModalOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 bottom-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">
                {locale === 'ar' ? 'سلة المشتريات' : locale === 'fr' ? 'Mon Panier' : 'My Cart'}
              </h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Top Purchase Button (Only if items exist) */}
          {items.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={handlePurchase}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {locale === 'ar' ? 'إتمام الشراء' : locale === 'fr' ? 'Commander' : 'Checkout'}
              </button>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <p className="text-gray-500 text-lg">
                  {locale === 'ar' ? 'سلة المشتريات فارغة' : locale === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
                </p>
                <button 
                  onClick={closeCart}
                  className="text-primary font-bold hover:underline"
                >
                  {locale === 'ar' ? 'تصفح المنتجات' : locale === 'fr' ? 'Parcourir les produits' : 'Browse Products'}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    <Image
                      src={item.productImage || '/placeholder.jpg'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{item.productName}</h3>
                      {item.variantName && (
                        <p className="text-sm text-gray-500">{item.variantName}</p>
                      )}
                      <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors shadow-sm disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Purchase Button */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex items-center justify-between mb-4 text-lg font-bold">
                <span className="text-gray-600">{locale === 'ar' ? 'المجموع' : locale === 'fr' ? 'Total' : 'Total'}</span>
                <span className="text-primary text-xl">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handlePurchase}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg transform hover:scale-[1.02]"
              >
                {locale === 'ar' ? 'إتمام الشراء' : locale === 'fr' ? 'Commander' : 'Checkout'}
                <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        locale={locale} 
      />
    </>
  );
}
