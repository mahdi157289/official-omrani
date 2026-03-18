import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/product-form';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    select: { id: true, nameAr: true, nameFr: true },
  });
}

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });

  if (!product) return null;
  return product;
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('admin');
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('edit')}</h1>
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
