'use client';
import { useSession } from 'next-auth/react';
import { Bell, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useUI } from '@/components/providers/ui-provider';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export function AdminHeader() {
  const { data: session } = useSession();
  const locale = useLocale();
  const t = useTranslations('admin');
  const [pendingOrderCount, setPendingOrderCount] = useState(0);

  // Poll for new pending orders every 30 seconds
  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const res = await fetch('/api/orders?status=PENDING&count=true');
        if (res.ok) {
          const data = await res.json();
          setPendingOrderCount(data.count ?? 0);
        }
      } catch (_) { }
    };

    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-primary">{t('panel')}</h1>
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors ml-4"
        >
          <ExternalLink className="w-4 h-4" />
          {t('viewSite')}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Bell with notification badge */}
        <Link
          href={`/${locale}/admin/orders`}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title={t('orders')}
        >
          <Bell className="w-5 h-5" />
          {pendingOrderCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {pendingOrderCount > 99 ? '99+' : pendingOrderCount}
            </span>
          )}
        </Link>


        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg ml-2">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {session?.user?.name || session?.user?.email}
          </span>
        </div>
      </div>
    </header>
  );
}

