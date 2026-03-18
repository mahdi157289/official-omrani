'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales } from '@/i18n';
import { Globe, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide all floating buttons on admin pages (including locale prefixes like /ar/admin)
  const isActuallyAdmin = pathname?.match(/\/(ar|fr|en)?\/?admin/);
  if (isActuallyAdmin) return null;

  const switchLocale = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  const scrollToLocation = (e: React.MouseEvent) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const isHomePage = pathname === `/${locale}` || pathname === `/${locale}/`;
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById('location');
      if (element) {
        const offset = 100; // navbar height + buffer
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 text-black">
        {/* Admin button - Always visible for quick access */}
        <Link
          href="/admin"
          className="w-12 h-12 rounded-full bg-gray-900/40 hover:bg-gray-900 text-white/70 hover:text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-white/10 hover:border-primary/50 mb-2 backdrop-blur-sm"
          title="Admin Dashboard"
        >
          <ShieldCheck className="w-5 h-5" />
        </Link>

        <div className="flex flex-col items-center bg-black/20 backdrop-blur-md rounded-full p-1.5 gold-border">
          {/* World Icon -> Location Link */}
          <a
            href={`/${locale}#location`}
            onClick={scrollToLocation}
            className="w-11 h-11 rounded-full bg-primary text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 glare-effect"
            title="Our Location"
          >
            <Globe className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Translation Options - Fixed Right above cart area */}
      <div className="fixed bottom-40 right-6 z-50 flex flex-col items-center gap-1.5 bg-black/20 backdrop-blur-md rounded-full p-1.5 gold-border">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 ${locale === loc
              ? 'bg-secondary text-white shadow-inner'
              : 'bg-white/10 text-white hover:bg-white/20'
              }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}
