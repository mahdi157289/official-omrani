import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { GalleryForm } from '@/components/admin/gallery-form';

export default async function EditGalleryItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.galleryItem.findUnique({
    where: { id },
    include: {
      media: true,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Gallery Item</h1>
      <GalleryForm initialData={item} />
    </div>
  );
}
