import { CoinLoader } from '@/components/ui/coin-loader';
import { getAdminTranslations } from '@/lib/admin-translations';

export default async function AdminLoading() {
  const t = await getAdminTranslations();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-[9999]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          <CoinLoader className="absolute inset-0 h-24 w-24 animate-spin text-primary opacity-20" wrapperClassName="contents" />
          <CoinLoader className="absolute inset-0 h-24 w-24 animate-spin-slow text-primary" wrapperClassName="contents" />
        </div>
        <p className="text-primary font-bold tracking-widest animate-pulse uppercase text-sm">
          {t('loading') || 'Loading...'}
        </p>
      </div>
    </div>
  );
}

