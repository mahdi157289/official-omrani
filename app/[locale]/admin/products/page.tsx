import { requireAdmin } from '@/lib/auth-helpers';
// Use dynamic import for prisma to ensure consistency across server components
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { getAdminTranslations, getAdminLocale } from '@/lib/admin-translations';

async function getProducts() {
  try {
    const { prisma } = await import('@/lib/prisma');
    return await prisma.product.findMany({
      include: {
        images: {
          take: 1,
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const t = await getAdminTranslations();
  const locale = await getAdminLocale();
  const products = await getProducts();
  const serializedProducts = products.map(p => ({
    ...p,
    basePrice: Number(p.basePrice)
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('products')}</h1>
        <Link
          href={`/${locale}/admin/products/new`}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addProduct')}
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
                {t('category')}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('price')}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('stock')}
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
            {serializedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.images[0] ? (
                    <div className="relative w-16 h-16">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altTextAr || product.nameAr}
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
                  <div className="text-sm font-medium text-gray-900">{product.nameAr}</div>
                  <div className="text-sm text-gray-500">{product.nameFr}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category.nameAr}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPrice(product.basePrice)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stockQuantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : product.status === 'OUT_OF_STOCK'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {t(product.status.toLowerCase())}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/${locale}/admin/products/${product.id}/edit`}
                      className="text-primary hover:text-primary-dark"
                      title={t('edit')}
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button className="text-red-600 hover:text-red-900" title={t('delete')}>
                      <Trash2 className="w-5 h-5" />
                    </button>
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





