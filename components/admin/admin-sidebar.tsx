'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  Settings,
  LogOut,
  Gift,
  Images,
  LayoutList,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useUI } from '@/components/providers/ui-provider';
import { useLocale, useTranslations } from 'next-intl';

const menuItems = [
  { href: '/admin', key: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/products', key: 'products', icon: Package },
  { href: '/admin/categories', key: 'categories', icon: LayoutList },
  { href: '/admin/packages', key: 'packages', icon: Gift },
  { href: '/admin/orders', key: 'orders', icon: ShoppingCart },
  { href: '/admin/media', key: 'media', icon: ImageIcon },
  { href: '/admin/gallery', key: 'gallery', icon: Images },
  { href: '/admin/settings', key: 'settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('admin');
  const { sidebarCollapsed, toggleSidebar } = useUI();
  const isRTL = locale === 'ar';

  return (
    <aside className={cn(
      'fixed top-16 h-[calc(100vh-4rem)] bg-white flex flex-col transition-all duration-300 z-40',
      isRTL ? 'right-0 border-l' : 'left-0 border-r',
      sidebarCollapsed ? 'w-20' : 'w-64'
    )}>
      <div className="p-3 border-b border-gray-200 flex items-center justify-between">
        <span className={cn('text-sm font-semibold text-gray-700', sidebarCollapsed && 'sr-only')}>
          {t('panel')}
        </span>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          {sidebarCollapsed
            ? (isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)
            : (isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)}
        </button>
      </div>
      <nav className={cn('flex-1 p-4 space-y-2', sidebarCollapsed && 'p-2')}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
          const isActive = pathWithoutLocale === item.href || pathWithoutLocale.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex items-center px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100',
                sidebarCollapsed && 'justify-center px-0'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className={cn('font-medium', isRTL ? 'mr-3' : 'ml-3')}>{t(item.key)}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
          className={cn(
            'flex items-center rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors',
            sidebarCollapsed ? 'justify-center p-2' : 'px-4 py-3 gap-3'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="font-medium">{t('logout')}</span>
          )}
        </button>
      </div>
    </aside>
  );
}







