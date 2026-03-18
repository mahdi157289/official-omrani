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
        <h1 className="text-3xl font-bold text-gray-900">{t('gallery')}</h1>
        <Link
          href={`/${locale}/admin/gallery/new`}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addItem')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('image')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('title')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('description')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('action')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
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
                  <div className="text-sm font-medium text-gray-900">{item.titleAr || '-'}</div>
                  <div className="text-sm text-gray-500">{item.titleFr || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{item.descriptionAr || '-'}</div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">{item.descriptionFr || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.displayOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${item.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
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
  );
}
