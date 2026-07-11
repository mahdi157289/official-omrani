import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-500 ease-in-out hover:bg-white/10 hover:shadow-[0_0_24px_rgba(255,214,0,0.2),0_0_48px_rgba(255,214,0,0.08)] hover:-translate-y-1 w-full gold-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
