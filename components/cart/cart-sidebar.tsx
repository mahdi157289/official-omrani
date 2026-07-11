'use client';

import { useCart } from '@/components/providers/cart-provider';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { OrderModal } from './order-modal';

export function CartSidebar({ locale }: { locale: string }) {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, total, formatPrice } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePurchase = () => {
    closeCart();
    router.push(`/${locale}/checkout`);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 bottom-0 right-0 w-full max-w-md bg-[#00353F] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 transform transition-transform duration-300 ease-in-out border-l border-white/10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-gold" />
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                {locale === 'ar' ? 'سلة المشتريات' : locale === 'fr' ? 'Mon Panier' : 'My Cart'}
              </h2>
              <span className="bg-gold/20 text-gold text-xs font-bold px-2 py-1 rounded-full">
                {items.length}
              </span>
            </div>
            <button 
              onClick={closeCart}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Top Purchase Button (Only if items exist) */}
          {items.length > 0 && (
            <div className="p-4 border-b border-white/10">
              <button
                onClick={handlePurchase}
                className="w-full py-3 bg-secondary text-white rounded-xl font-bold hover:bg-primary transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {locale === 'ar' ? 'إتمام الشراء' : locale === 'fr' ? 'Commander' : 'Checkout'}
              </button>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/20">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <p className="text-white/50 text-lg">
                  {locale === 'ar' ? 'سلة المشتريات فارغة' : locale === 'fr' ? 'Votre panier est vide' : 'Your cart is empty'}
                </p>
                <button 
                  onClick={closeCart}
                  className="text-secondary font-bold hover:underline"
                >
                  {locale === 'ar' ? 'تصفح المنتجات' : locale === 'fr' ? 'Parcourir les produits' : 'Browse Products'}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                    <Image
                      src={item.productImage || '/placeholder.jpg'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="font-bold text-white line-clamp-1">{item.productName}</h3>
                      {item.variantName && (
                        <p className="text-sm text-white/50">{item.variantName}</p>
                      )}
                      <p className="text-gold font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-white/10 rounded-md transition-colors shadow-sm disabled:opacity-50"
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
            <div className="p-6 border-t border-white/10 bg-black/40">
              <div className="flex items-center justify-between mb-4 text-lg font-bold">
                <span className="text-white/60">{locale === 'ar' ? 'المجموع' : locale === 'fr' ? 'Total' : 'Total'}</span>
                <span className="text-gold text-xl">{formatPrice(total)}</span>
              </div>
              <button
                onClick={handlePurchase}
                className="w-full py-4 bg-secondary text-white rounded-xl font-bold hover:bg-primary transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg transform hover:scale-[1.02]"
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
      <div className="text-black">
        <OrderModal 
          isOpen={isOrderModalOpen} 
          onClose={() => setIsOrderModalOpen(false)} 
          locale={locale} 
        />
      </div>
    </>
  );
}
