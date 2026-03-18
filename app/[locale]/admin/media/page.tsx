import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { MediaUpload } from '@/components/admin/media-upload';
import { getAdminTranslations } from '@/lib/admin-translations';

async function getMedia() {
  return await prisma.media.findMany({
    orderBy: {
      uploadedAt: 'desc',
    },
    take: 50,
  });
}

export default async function AdminMediaPage() {
  const t = await getAdminTranslations();
  const media = await getMedia();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('media')}</h1>
        <MediaUpload />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow overflow-hidden group hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={item.url}
                alt={item.altTextAr || item.fileName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button className="text-white hover:text-red-400 transition-colors" title={t('delete')}>
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-600 truncate">{item.fileName}</p>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{t('noMedia') || "No media files yet."}</p>
        </div>
      )}
    </div>
  );
}





