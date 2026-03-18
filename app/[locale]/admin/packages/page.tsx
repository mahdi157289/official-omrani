import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import Image from 'next/image';
import { DeleteButton } from '@/components/admin/delete-button';
import { formatPrice } from '@/lib/utils';
import { getAdminTranslations, getAdminLocale } from '@/lib/admin-translations';

async function getPackages() {
  return await prisma.package.findMany({
    include: {
      image: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });
}

export default async function AdminPackagesPage() {
  const t = await getAdminTranslations();
  const locale = await getAdminLocale();
  const packages = await getPackages();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('packages')}</h1>
        <Link
          href={`/${locale}/admin/packages/new`}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addPackage')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('image')}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('name')}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('price')}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('displayOrder')}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('action')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {pkg.image ? (
                    <div className="relative w-16 h-16">
                      <Image
                        src={pkg.image.url}
                        alt={pkg.image.altTextAr || pkg.nameAr}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-400">{t('noImage')}</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{pkg.nameAr}</div>
                  <div className="text-sm text-gray-500">{pkg.nameFr}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {pkg.discountPrice ? (
                    <div className="flex flex-col">
                      <span className="text-red-600 font-medium">{formatPrice(pkg.discountPrice)}</span>
                      <span className="text-gray-400 line-through text-xs">{formatPrice(pkg.price)}</span>
                    </div>
                  ) : (
                    <span>{formatPrice(pkg.price)}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {pkg.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${pkg.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {pkg.isActive ? t('active') : t('draft')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/${locale}/admin/packages/${pkg.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      title={t('edit')}
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <DeleteButton
                      apiEndpoint="/api/packages"
                      itemId={pkg.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
