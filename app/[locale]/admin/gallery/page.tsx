import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import Image from 'next/image';
import { DeleteButton } from '@/components/admin/delete-button';
import { getAdminTranslations, getAdminLocale } from '@/lib/admin-translations';

async function getGalleryItems() {
  return await prisma.galleryItem.findMany({
    include: {
      media: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });
}

export default async function AdminGalleryPage() {
  const t = await getAdminTranslations();
  const locale = await getAdminLocale();
  const items = await getGalleryItems();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">{t('gallery')}</h1>
        <Link
          href={`/${locale}/admin/gallery/new`}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addItem')}
        </Link>
      </div>

      <div className="glass-card-effect rounded-lg shadow overflow-hidden border border-white/10">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/5">
          {items.map((item) => (
            <div key={item.id} className="p-4 space-y-3 bg-transparent">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={item.media.url}
                    alt={item.titleAr || t('gallery')}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{item.titleAr || '-'}</div>
                  <div className="text-sm text-white/50 truncate">{item.titleFr || '-'}</div>
                </div>
                <span
                  className={`px-2 py-1 text-[10px] font-semibold rounded-full shrink-0 ${item.isActive
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-500/20 text-gray-400'
                    }`}
                >
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="text-sm">
                <div className="text-white/90 line-clamp-2">{item.descriptionAr || '-'}</div>
                <div className="text-white/40 line-clamp-2 text-xs mt-1">{item.descriptionFr || '-'}</div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/40">
                  Order: <span className="font-medium text-white">{item.displayOrder}</span>
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/${locale}/admin/gallery/${item.id}/edit`}
                    className="p-2 text-primary bg-primary/10 rounded hover:bg-primary/20"
                    title={t('edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton
                    apiEndpoint="/api/gallery"
                    itemId={item.id}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('image')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('title')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('description')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.media.url}
                        alt={item.titleAr || t('gallery')}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{item.titleAr || '-'}</div>
                    <div className="text-sm text-white/50">{item.titleFr || '-'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white/90 max-w-xs truncate">{item.descriptionAr || '-'}</div>
                    <div className="text-sm text-white/50 max-w-xs truncate">{item.descriptionFr || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                    {item.displayOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${item.isActive
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                        }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${locale}/admin/gallery/${item.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title={t('edit')}
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <DeleteButton
                        apiEndpoint="/api/gallery"
                        itemId={item.id}
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
