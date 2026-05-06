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
        <h1 className="text-3xl font-bold text-white">{t('packages')}</h1>
        <Link
          href={`/${locale}/admin/packages/new`}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addPackage')}
        </Link>
      </div>

      <div className="glass-card-effect rounded-lg shadow overflow-hidden border border-white/10">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/5">
          {packages.map((pkg) => (
            <div key={pkg.id} className="p-4 space-y-3 bg-transparent">
              <div className="flex items-center gap-4">
                {pkg.image ? (
                  <div className="relative w-16 h-16 shrink-0">
                    <Image
                      src={pkg.image.url}
                      alt={pkg.image.altTextAr || pkg.nameAr}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded shrink-0 flex items-center justify-center">
                    <span className="text-xs text-gray-400">{t('noImage')}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{pkg.nameAr}</div>
                  <div className="text-sm text-white/50 truncate">{pkg.nameFr}</div>
                </div>
                <span
                  className={`px-2 py-1 text-[10px] font-semibold rounded-full shrink-0 ${pkg.isActive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                    }`}
                >
                  {pkg.isActive ? t('active') : t('draft')}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs text-white/40">
                  {t('displayOrder')}: <span className="font-medium text-white">{pkg.displayOrder}</span>
                </span>
                <div className="text-end">
                  {pkg.discountPrice ? (
                    <div className="flex flex-col">
                      <span className="text-red-400 font-bold">{formatPrice(Number(pkg.discountPrice))}</span>
                      <span className="text-white/40 line-through text-xs">{formatPrice(Number(pkg.price))}</span>
                    </div>
                  ) : (
                    <span className="font-bold text-white">{formatPrice(Number(pkg.price))}</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-3">
                <Link
                  href={`/${locale}/admin/packages/${pkg.id}/edit`}
                  className="p-2 text-primary bg-primary/10 rounded hover:bg-primary/20"
                  title={t('edit')}
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <DeleteButton
                  apiEndpoint="/api/packages"
                  itemId={pkg.id}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('image')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('price')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('displayOrder')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-end text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-white/5 transition-colors">
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
                    <div className="text-sm font-medium text-white">{pkg.nameAr}</div>
                    <div className="text-sm text-white/50">{pkg.nameFr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {pkg.discountPrice ? (
                      <div className="flex flex-col">
                        <span className="text-red-400 font-medium">{formatPrice(Number(pkg.discountPrice))}</span>
                        <span className="text-white/40 line-through text-xs">{formatPrice(Number(pkg.price))}</span>
                      </div>
                    ) : (
                      <span className="text-white font-bold">{formatPrice(Number(pkg.price))}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                    {pkg.displayOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${pkg.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                        }`}
                    >
                      {pkg.isActive ? t('active') : t('draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/admin/packages/${pkg.id}/edit`}
                        className="text-primary hover:text-primary-dark"
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
    </div>
  );
}
