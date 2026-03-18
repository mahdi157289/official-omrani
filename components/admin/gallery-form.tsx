'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaUpload } from './media-upload';
import { X } from 'lucide-react';
import { CoinLoader } from '@/components/ui/coin-loader';
import Image from 'next/image';

interface GalleryFormProps {
  initialData?: any;
}

export function GalleryForm({ initialData }: GalleryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<any>(initialData?.media || null);

  const [formData, setFormData] = useState({
    titleAr: initialData?.titleAr || '',
    titleFr: initialData?.titleFr || '',
    descriptionAr: initialData?.descriptionAr || '',
    descriptionFr: initialData?.descriptionFr || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    displayOrder: initialData?.displayOrder || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaUpload = (newMedia: any) => {
    setMedia(newMedia);
  };

  const removeMedia = () => {
    setMedia(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!media) {
      alert('Please upload an image');
      return;
    }

    setLoading(true);

    try {
      const url = initialData
        ? `/api/gallery/${initialData.id}`
        : '/api/gallery';

      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          mediaId: media.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save gallery item');
      }

      router.push('/admin/gallery');
      router.refresh();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Gallery Item Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title (Arabic)</label>
            <input
              type="text"
              name="titleAr"
              value={formData.titleAr}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-black bg-white placeholder-gray-400"
              placeholder="Ø§ÙƒØªØ¨ Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ù‡Ù†Ø§"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Title (French)</label>
            <input
              type="text"
              name="titleFr"
              value={formData.titleFr}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-black bg-white placeholder-gray-400"
              placeholder="Entrez le titre ici"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
            <textarea
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-black bg-white placeholder-gray-400"
              placeholder="Ø§ÙƒØªØ¨ Ø§Ù„ÙˆØµÙ Ù‡Ù†Ø§"
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description (French)</label>
            <textarea
              name="descriptionFr"
              value={formData.descriptionFr}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-black bg-white placeholder-gray-400"
              placeholder="Entrez la description ici"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Display Order</label>
            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-black bg-white"
            />
          </div>
          <div className="flex items-center mt-8">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Image</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media ? (
              <div className="relative group aspect-square">
                <Image
                  src={media.url}
                  alt={media.altTextAr || 'Gallery image'}
                  fill
                  className="object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <MediaUpload onUploadComplete={handleMediaUpload} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <CoinLoader className="w-4 h-4 animate-spin" wrapperClassName="contents" />}
          {initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
