'use client';

import { ShoppingCart } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/providers/cart-provider';
import { motion } from 'framer-motion';

export function FloatingCart() {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const { itemCount, toggleCart } = useCart();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div
      className={`fixed bottom-24 right-6 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
    >
      <motion.button
        onClick={toggleCart}
        animate={isVisible ? {
          y: [0, -8, 0],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-12 h-12 rounded-full bg-secondary/90 hover:bg-secondary text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 relative group gold-border"
        aria-label="View Cart"
      >
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {itemCount}
          </span>
        )}
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {locale === 'ar' ? 'السلة' : locale === 'fr' ? 'Panier' : 'Cart'}
        </span>
      </motion.button>
    </div>
  );
}
