'use client';

export function DecoSeparator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 opacity-100 justify-center ${className}`}>
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-8 md:w-16"></div>
      
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-1 rounded-full bg-[#D4AF37]/60"></div>
        <div className="relative flex items-center justify-center w-4 h-4">
          <div className="absolute inset-0 border border-[#D4AF37] rotate-45 transform transition-transform duration-700 hover:rotate-180"></div>
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45"></div>
        </div>
        <div className="w-1 h-1 rounded-full bg-[#D4AF37]/60"></div>
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent w-8 md:w-16"></div>
    </div>
  );
}
