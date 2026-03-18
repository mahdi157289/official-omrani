import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Edit } from 'lucide-react';
import { DeleteButton } from '@/components/admin/delete-button';
import { getAdminTranslations, getAdminLocale } from '@/lib/admin-translations';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    const t = await getAdminTranslations();
    const locale = await getAdminLocale();
    const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{t('categories')}</h1>
                <Link
                    href={`/${locale}/admin/categories/new`}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {t('addCategory')}
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('name')}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('products')}</th>
                            <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                            <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase tracking-wider">{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{category.nameFr}</div>
                                    <div className="text-sm text-gray-500">{category.nameAr}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {category._count.products}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {category.isActive ? t('active') : t('draft')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-end text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <Link
                                            href={`/${locale}/admin/categories/${category.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                            title={t('edit')}
                                        >
                                            <Edit className="w-5 h-5" />
                                        </Link>
                                        <DeleteButton
                                            itemId={category.id}
                                            apiEndpoint="/api/categories"
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
