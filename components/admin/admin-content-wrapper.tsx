'use client';

import { useUI } from '@/components/providers/ui-provider';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export function AdminContentWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUI();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className={cn(
      'flex-1 transition-all duration-300 w-full lg:w-auto',
      isRTL
        ? (sidebarCollapsed ? 'lg:mr-20' : 'lg:mr-64')
        : (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64')
    )}>
      {children}
    </div>
  );
}

