import { CategoryForm } from '@/components/admin/category-form';
import { getAdminTranslations } from '@/lib/admin-translations';

export default async function NewCategoryPage() {
    const t = await getAdminTranslations();
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{t('addCategory')}</h1>
            </div>
            <CategoryForm />
        </div>
    );
}
