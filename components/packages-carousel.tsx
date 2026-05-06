'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { FadeIn } from './ui/fade-in';
import { PackageCard } from './package-card';

interface PackagesCarouselProps {
  locale: string;
  packages: any[];
}

export function PackagesCarousel({ locale, packages }: PackagesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    if (packages.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let frameCount = 0;

    const scroll = () => {
      if (!isHovered && !isDragging) {
        frameCount++;
        // Very slow pace: scroll 1px every 3 frames
        if (frameCount % 3 === 0) {
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
  }, [isHovered, isDragging, packages.length]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollStart - walk;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.touches[0].pageX - container.offsetLeft);
    setScrollStart(container.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollStart - walk;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex overflow-x-auto gap-6 md:gap-8 pb-6 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide select-none cursor-grab active:cursor-grabbing"
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
      }}
    >
      {packages.map((pkg, index) => (
        <div
          key={pkg.id}
          className="flex-none w-[85vw] md:w-[380px] snap-center"
          onClickCapture={(e) => {
            if (hasDragged) {
              e.preventDefault();
              e.stopPropagation();
              setHasDragged(false);
            }
          }}
        >
          <FadeIn delay={index * 0.1}>
            <PackageCard pkg={pkg} locale={locale} />
          </FadeIn>
        </div>
      ))}
    </div>
  );
}
