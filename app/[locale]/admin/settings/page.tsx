import { requireAdmin } from '@/lib/auth-helpers';
import { getAdminTranslations } from '@/lib/admin-translations';
import { SettingsForm } from '@/components/admin/settings-form';

export default async function AdminSettingsPage() {
  const t = await getAdminTranslations();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('settings')}</h1>
        <p className="text-gray-500">Configrez les paramètres de votre boutique et les taux de change.</p>
      </div>

      <SettingsForm />
    </div>
  );
}





