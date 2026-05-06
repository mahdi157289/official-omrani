import { requireAdmin } from '@/lib/auth-helpers';
// Use dynamic import for prisma to ensure consistency across server components
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { DeleteButton } from '@/components/admin/delete-button';
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
        <h1 className="text-3xl font-bold text-white">{t('products')}</h1>
        <Link
          href={`/${locale}/admin/products/new`}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t('addProduct')}
        </Link>
      </div>

      <div className="glass-card-effect rounded-lg shadow overflow-hidden border border-white/10">
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/5">
          {serializedProducts.map((product) => (
            <div key={product.id} className="p-4 space-y-3 bg-transparent">
              <div className="flex items-center gap-4">
                {product.images[0] ? (
                  <div className="relative w-16 h-16 shrink-0">
                    <Image
                      src={product.images[0].url}
                      alt={product.images[0].altTextAr || product.nameAr}
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
                  <div className="text-sm font-medium text-white truncate">{product.nameAr}</div>
                  <div className="text-sm text-white/50 truncate">{product.nameFr}</div>
                </div>
                <span
                  className={`px-2 py-1 text-[10px] font-semibold rounded-full shrink-0 ${product.status === 'ACTIVE'
                    ? 'bg-green-500/20 text-green-400'
                    : product.status === 'OUT_OF_STOCK'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                    }`}
                >
                  {t(product.status.toLowerCase())}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{product.category.nameAr}</span>
                <span className="font-bold text-white">{formatPrice(product.basePrice)}</span>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/40">
                  {t('stock')}: <span className="font-medium text-white">{product.stockQuantity}</span>
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/${locale}/admin/products/${product.id}/edit`}
                    className="p-2 text-primary bg-primary/10 rounded hover:bg-primary/20"
                    title={t('edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <DeleteButton
                    apiEndpoint="/api/products"
                    itemId={product.id}
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
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('image')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('name')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('category')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('price')}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">
                  {t('stock')}
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
              {serializedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
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
                    <div className="text-sm font-medium text-white">{product.nameAr}</div>
                    <div className="text-sm text-white/50">{product.nameFr}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                    {product.category.nameAr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">
                    {formatPrice(product.basePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/50">
                    {product.stockQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === 'ACTIVE'
                        ? 'bg-green-500/20 text-green-400'
                        : product.status === 'OUT_OF_STOCK'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-500/20 text-gray-400'
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
                      <DeleteButton
                        apiEndpoint="/api/products"
                        itemId={product.id}
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





