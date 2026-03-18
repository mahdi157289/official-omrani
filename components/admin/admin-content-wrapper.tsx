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
      'flex-1 transition-all duration-300',
      isRTL
        ? (sidebarCollapsed ? 'mr-20' : 'mr-64')
        : (sidebarCollapsed ? 'ml-20' : 'ml-64')
    )}>
      {children}
    </div>
  );
}

