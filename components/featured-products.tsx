'use client';

import { ProductCard } from './product-card';
import Link from 'next/link';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Product {
  id: string;
  slug: string;
  nameAr: string;
  nameFr: string;
  nameEn?: string;
  basePrice: number | string | any;
  isNew?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  images: Array<{
    url: string;
    altTextAr?: string;
    altTextFr?: string;
    altTextEn?: string;
  }>;
  category: {
    nameAr: string;
    nameFr: string;
    nameEn?: string | null;
  };
}

export function FeaturedProducts({ locale, products = [] }: { locale: string; products?: any[] }) {
  const t = useTranslations('home');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (products.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let frameCount = 0;

    const scroll = () => {
      if (!isHovered && !isDragging) {
        frameCount++;
        if (frameCount % 2 === 0) {
          if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
            container.scrollLeft = 0;
          } else {
            container.scrollLeft += 1;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging, products.length]);

  const scrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);

  // --- Drag-to-scroll handlers ---
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier for faster drag
    container.scrollLeft = scrollStart - walk;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
  }, [isDragging, startX, scrollStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setIsHovered(false);
    const container = scrollContainerRef.current;
    if (container) {
      container.style.cursor = 'grab';
      container.style.userSelect = '';
    }
  }, []);

  // Touch drag support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollStart - walk;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
  }, [isDragging, startX, scrollStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="relative group">
      {/* Navigation Buttons */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4 md:-ml-5 hover:scale-110 active:scale-90"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4 md:-mr-5 hover:scale-110 active:scale-95"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Fading edges */}
      <div className="absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent z-[5] pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent z-[5] pointer-events-none" />

      {/* Scrollable Container with drag support */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-8 mb-12 pb-4 scrollbar-hide select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px] md:min-w-[320px] transform hover:-translate-y-2 transition-transform duration-300"
            onClickCapture={(e) => {
              // Prevent clicks on links/buttons if the user just dragged
              if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                setHasDragged(false);
              }
            }}
          >
            <ProductCard product={product} locale={locale} />
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center">
        <div className="h-px bg-primary/20 w-full max-w-xs hidden md:block"></div>
        <Link
          href={`/${locale}/shop`}
          className="mx-6 group relative inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-xl gold-border glare-effect"
        >
          <span>
            {t('viewAllProducts')}
          </span>
          <svg
            className="w-5 h-5 transform transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <div className="h-px bg-primary/20 w-full max-w-xs hidden md:block"></div>
      </div>
    </div>
  );
}
