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
                <h1 className="text-2xl font-bold text-white">{t('categories')}</h1>
                <Link
                    href={`/${locale}/admin/categories/new`}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    {t('addCategory')}
                </Link>
            </div>

            <div className="glass-card-effect rounded-lg shadow overflow-hidden border border-white/10">
                {/* Mobile View */}
                <div className="md:hidden divide-y divide-white/5">
                    {categories.map((category) => (
                        <div key={category.id} className="p-4 space-y-3 bg-transparent">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-medium text-white">{category.nameFr}</div>
                                    <div className="text-sm text-white/50">{category.nameAr}</div>
                                </div>
                                <span className={`px-2 py-1 text-[10px] font-semibold rounded-full ${category.isActive
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {category.isActive ? t('active') : t('draft')}
                                </span>
                            </div>
                            
                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-white/40">
                                    {t('products')}: <span className="font-medium text-white">{category._count.products}</span>
                                </span>
                                <div className="flex justify-end gap-3">
                                    <Link
                                        href={`/${locale}/admin/categories/${category.id}`}
                                        className="p-2 text-primary bg-primary/10 rounded hover:bg-primary/20"
                                        title={t('edit')}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <DeleteButton
                                        itemId={category.id}
                                        apiEndpoint="/api/categories"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">{t('name')}</th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">{t('products')}</th>
                                <th className="px-6 py-3 text-start text-xs font-medium text-white/40 uppercase tracking-wider">{t('status')}</th>
                                <th className="px-6 py-3 text-end text-xs font-medium text-white/40 uppercase tracking-wider">{t('action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{category.nameFr}</div>
                                        <div className="text-sm text-white/50">{category.nameAr}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-white/60">
                                        {category._count.products}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
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
        </div>
    );
}
