'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaUpload } from './media-upload';
import { X } from 'lucide-react';
import { CoinLoader } from '@/components/ui/coin-loader';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface PackageFormProps {
  initialData?: any;
}

export function PackageForm({ initialData }: PackageFormProps) {
  const router = useRouter();
  const t = useTranslations('admin');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(initialData?.image || null);

  const [formData, setFormData] = useState({
    nameAr: initialData?.nameAr || '',
    nameFr: initialData?.nameFr || '',
    nameEn: initialData?.nameEn || '',
    descriptionAr: initialData?.descriptionAr || '',
    descriptionFr: initialData?.descriptionFr || '',
    descriptionEn: initialData?.descriptionEn || '',
    ingredientsAr: initialData?.ingredientsAr || '',
    ingredientsFr: initialData?.ingredientsFr || '',
    ingredientsEn: initialData?.ingredientsEn || '',
    price: initialData?.price || '',
    discountPrice: initialData?.discountPrice || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    isFeatured: initialData?.isFeatured || false,
    displayOrder: initialData?.displayOrder || 0,
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => {
        const newData = { ...prev, [name]: value };
        return newData;
      });
    }
  };

  const handleImageUpload = (newMedia: any) => {
    setImage(newMedia);
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData
        ? `/api/packages/${initialData.id}`
        : '/api/packages';

      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          slug: generateSlug(formData.nameFr) || `package-${Date.now()}`,
          imageId: image?.id,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save package');
      }

      router.push('/admin/packages');
      router.refresh();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">{t('basicInfo')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('nameAr')}</label>
            <input
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder={t('placeholderAr')}
              required
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('nameFr')}</label>
            <input
              type="text"
              name="nameFr"
              value={formData.nameFr}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder={t('placeholderFr')}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('nameEn')}</label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder={t('placeholderEn')}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('descriptionAr')}</label>
            <textarea
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder={t('placeholderAr')}
              required
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('descriptionFr')}</label>
            <textarea
              name="descriptionFr"
              value={formData.descriptionFr}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder={t('placeholderFr')}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('descriptionEn')}</label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder={t('placeholderEn')}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">{t('packageContents')}</h2>
        <p className="text-sm text-gray-500 mb-6">{t('packageContentsDesc')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('packageContentsAr')}</label>
            <textarea
              name="ingredientsAr"
              value={formData.ingredientsAr}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder="Ù…Ø«Ø§Ù„: 500 Ø¬Ø±Ø§Ù… Ù…Ù‚Ø±ÙˆØ¶ ÙƒÙ„Ø§Ø³ÙŠÙƒÙŠØŒ 500 Ø¬Ø±Ø§Ù… Ù…Ù‚Ø±ÙˆØ¶ Ø¨Ø§Ù„ØªÙ…Ø±..."
              dir="rtl"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('packageContentsFr')}</label>
            <textarea
              name="ingredientsFr"
              value={formData.ingredientsFr}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder="Ex: 500g Makroudh Classique, 500g Makroudh aux Dattes..."
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('packageContentsEn')}</label>
            <textarea
              name="ingredientsEn"
              value={formData.ingredientsEn}
              onChange={handleChange}
              rows={5}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder="Ex: 500g Classic Makroudh, 500g Dates Makroudh..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">{t('pricingDetails')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('priceTnd')}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.001"
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder="e.g., 12.500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('discountPriceTnd')}</label>
            <input
              type="number"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              step="0.001"
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder="e.g., 10.000"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{t('displayOrder')}</label>
            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-primary focus:border-primary text-gray-900 bg-white placeholder-gray-400"
              placeholder="e.g., 1"
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('visibility')}</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isActive: true }))}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${formData.isActive
                  ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-500 ring-offset-2'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${formData.isActive ? 'bg-white' : 'bg-green-500'}`} />
                  {t('showOnSite')}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isActive: false }))}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${!formData.isActive
                  ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-500 ring-offset-2'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${!formData.isActive ? 'bg-white' : 'bg-red-500'}`} />
                  {t('hideFromSite')}
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.isFeatured
                ? 'border-[#808000] bg-[#808000]/10' // Olive color
                : 'border-gray-200 hover:border-[#808000]/50'
                }`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${formData.isFeatured ? 'bg-[#808000] border-[#808000]' : 'border-gray-300'
                }`}>
                {formData.isFeatured && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="hidden"
              />
              <div>
                <span className="block text-base font-bold text-gray-900">{t('featuredPackage')}</span>
                <span className="block text-sm text-gray-500">{t('featuredPackageDesc')}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">{t('packageImage')}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {image ? (
              <div className="relative group aspect-square">
                <Image
                  src={image.url}
                  alt={image.altTextAr || 'Package image'}
                  fill
                  className="object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <MediaUpload onUploadComplete={handleImageUpload} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between md:justify-end gap-6 pt-8 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full sm:w-auto md:w-48 px-8 py-4 border-2 border-red-500 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-xl font-bold transition-colors text-lg"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto md:w-64 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
        >
          {loading && <CoinLoader className="w-6 h-6 animate-spin" wrapperClassName="contents" />}
          {initialData ? t('updatePackage') : t('createPackage')}
        </button>
      </div>
    </form>
  );
}
