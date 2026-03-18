import { requireAdmin } from '@/lib/auth-helpers';
import { getAdminTranslations } from '@/lib/admin-translations';

export default async function AdminSettingsPage() {
  const t = await getAdminTranslations();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings')}</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('siteConfiguration')}</h2>
        <p className="text-gray-600">{t('comingSoon')}</p>
      </div>
    </div>
  );
}





