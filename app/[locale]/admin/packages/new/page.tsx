import { requireAdmin } from '@/lib/auth-helpers';
import { PackageForm } from '@/components/admin/package-form';
import { getAdminTranslations } from '@/lib/admin-translations';

export default async function NewPackagePage() {
  const t = await getAdminTranslations();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('createPackage')}</h1>
      <PackageForm />
    </div>
  );
}
