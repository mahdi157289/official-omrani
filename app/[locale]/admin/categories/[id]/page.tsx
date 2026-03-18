import { prisma } from '@/lib/prisma';
import { CategoryForm } from '@/components/admin/category-form';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function EditCategoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const t = await getTranslations('admin');

    const category = await prisma.category.findUnique({
        where: { id },
        include: { image: true }
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{t('edit')}</h1>
            </div>
            <CategoryForm initialData={category} />
        </div>
    );
}
