'use client';

import { useState, useEffect } from 'react';
import { Globe, Lamp, ExternalLink } from 'lucide-react';
import { locales } from '@/i18n';
import Link from 'next/link';
import { useUI } from '@/components/providers/ui-provider';

const localeNames: Record<string, string> = {
  ar: 'العربية',
  fr: 'Français',
  en: 'English',
};

export function AdminTools() {
  const [isOpen, setIsOpen] = useState(false);
  const { show3DItems, toggle3DItems, adminLocale, setAdminLocale } = useUI();


  useEffect(() => { }, []);

  const setLocale = (loc: string) => {
    setAdminLocale(loc);
    setIsOpen(false);
  };
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Back to Website Button */}
      <Link
        href="/"
        className="w-12 h-12 rounded-full bg-gray-900 border-2 border-primary/30 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 glare-effect group overflow-hidden relative"
        title="Back to Website"
      >
        <ExternalLink className="w-5 h-5 relative z-10" />
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity" />
      </Link>
      <button
        onClick={toggle3DItems}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 gold-border glare-effect ${show3DItems
          ? 'bg-amber-500 text-white'
          : 'bg-gray-800 text-gray-400'
          }`}
        title={show3DItems ? 'Hide 3D Items' : 'Show 3D Items'}
      >
        <Lamp className={`w-6 h-6 transition-transform duration-500 ${show3DItems ? 'rotate-0 scale-110' : 'rotate-12 scale-100 opacity-70'}`} />
      </button>

    </div>
  );
}
