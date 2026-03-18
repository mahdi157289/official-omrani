'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const commonT = useTranslations('common');
  const [year, setYear] = useState<number | string>('');

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#F2C782] text-gray-900 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="inline-block mb-6">
              <Image
                src="/media/logo.png"
                alt="Makroudh Omrani"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </Link>
            <p className="text-gray-700 mb-4">
              {t('tagline')}
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/makroudhomrani"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/makroudhomrani"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}`} className="text-gray-700 hover:text-secondary transition-colors">
                  {commonT('home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop`} className="text-gray-700 hover:text-secondary transition-colors">
                  {commonT('shop')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-gray-700 hover:text-secondary transition-colors">
                  {commonT('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-700 hover:text-secondary transition-colors">
                  {commonT('contact')}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-500 hover:text-secondary transition-colors text-xs mt-4 block border-t border-gray-400/30 pt-2">
                  {commonT('dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">
              {t('customerService')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/orders`} className="text-gray-700 hover:text-secondary transition-colors">
                  {commonT('orders')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-gray-700 hover:text-secondary transition-colors">
                  {commonT('faq')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="text-gray-700 hover:text-secondary transition-colors">
                  {t('shipping')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">
              {commonT('contactInfo')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">
                  {commonT('locationValue')}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href="tel:+21694700009" className="text-gray-700 hover:text-secondary transition-colors text-sm">
                  <span dir="ltr" className="inline-block">94 700 009</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <a href="mailto:info@makroudhomrani.tn" className="text-gray-700 hover:text-secondary transition-colors text-sm">
                  info@makroudhomrani.tn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-500 mt-8 pt-8 text-center text-gray-600 text-sm">
          <p>
            © {year || '2024'} Makroudh Omrani. {t('rightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
