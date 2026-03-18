import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  // Traditional geometric "tatou" pattern (continuous diamond chain)
  const tatouPattern = `data:image/svg+xml,%3Csvg width='24' height='48' viewBox='0 0 24 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0 L24 24 L12 48 L0 24 Z' fill='none' stroke='%23D4AF37' stroke-width='1.5' opacity='0.6'/%3E%3Cpath d='M12 12 L18 24 L12 36 L6 24 Z' fill='%23D4AF37' opacity='0.4'/%3E%3Ccircle cx='12' cy='0' r='2' fill='%23D4AF37' opacity='0.8'/%3E%3Ccircle cx='12' cy='48' r='2' fill='%23D4AF37' opacity='0.8'/%3E%3C/svg%3E`;

  return (
    <div className="relative flex items-stretch justify-center gap-6 md:gap-10">
      {/* Left Continuous Tatou Decoration */}
      <div className="hidden lg:flex flex-col items-center justify-center py-8 opacity-80 shrink-0">
        <div 
          className="w-6 h-full animate-scroll-y"
          style={{
            backgroundImage: `url("${tatouPattern}")`,
            backgroundRepeat: 'repeat-y',
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        />
      </div>

      <div
        className={cn(
        "bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-500 ease-in-out hover:bg-white/10 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:-translate-y-1 w-full gold-border",
        className
      )}
        {...props}
      >
        {children}
      </div>

      {/* Right Continuous Tatou Decoration */}
      <div className="hidden lg:flex flex-col items-center justify-center py-8 opacity-80 shrink-0">
        <div 
          className="w-6 h-full animate-scroll-y"
          style={{
            backgroundImage: `url("${tatouPattern}")`,
            backgroundRepeat: 'repeat-y',
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        />
      </div>
    </div>
  );
}
