import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/product-form';
import { getAdminTranslations } from '@/lib/admin-translations';

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, nameAr: true, nameFr: true },
  });
}

export default async function NewProductPage() {
  const t = await getAdminTranslations();
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('addProduct')}</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
