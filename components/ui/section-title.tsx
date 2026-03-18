'use client';

import { FadeIn } from './fade-in';

interface SectionTitleProps {
  title: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionTitle({ title, align = 'center', className = '' }: SectionTitleProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-16 ${alignmentClasses[align]} ${className}`}>
      <FadeIn>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 relative inline-block tracking-[0.2em] uppercase">
          {title}
        </h2>
        
        {/* Decorative Separator */}
        <div className={`mt-6 flex items-center gap-4 opacity-100 ${align === 'center' ? 'justify-center' : align === 'left' ? 'justify-start' : 'justify-end'}`}>
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-12 md:w-32"></div>
          
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60"></div>
            <div className="relative flex items-center justify-center w-6 h-6">
              <div className="absolute inset-0 border border-[#D4AF37] rotate-45 transform transition-transform duration-700 hover:rotate-180"></div>
              <div className="w-2.5 h-2.5 bg-[#D4AF37] rotate-45"></div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60"></div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-12 md:w-32"></div>
        </div>
      </FadeIn>
    </div>
  );
}
