import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { PackageForm } from '@/components/admin/package-form';
import { getTranslations } from 'next-intl/server';

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations('admin');

  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      image: true,
    },
  });

  if (!pkg) {
    notFound();
  }

  // Convert Decimals to numbers for the form
  const serializedPackage = {
    ...pkg,
    price: Number(pkg.price),
    discountPrice: pkg.discountPrice ? Number(pkg.discountPrice) : null,
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('updatePackage')}</h1>
      <PackageForm initialData={serializedPackage} />
    </div>
  );
}
