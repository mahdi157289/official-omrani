'use client';

import { Phone } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingPhone() {
  const locale = useLocale();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
      className={`fixed bottom-8 right-6 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
    >
      <div 
        className="relative flex items-center justify-end"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.a
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              href="tel:+21694700009"
              className="absolute right-full mr-3 bg-primary text-white font-bold py-2 px-4 rounded-full shadow-lg whitespace-nowrap text-lg gold-border glare-effect pointer-events-auto"
            >
              94 700 009
            </motion.a>
          )}
        </AnimatePresence>

        <a
          href="tel:+21694700009"
          className="w-12 h-12 rounded-full bg-[#437983] hover:bg-[#F2C782] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 relative group border-2 border-[#D4AF37]/30"
          aria-label="Call Us"
        >
          <Phone className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} />
          
          <span className="absolute -top-10 right-0 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {locale === 'ar' ? 'اتصل بنا' : locale === 'fr' ? 'Appelez-nous' : 'Call Us'}
          </span>
        </a>
      </div>
    </div>
  );
}
