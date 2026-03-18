'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MediaUpload } from './media-upload';
import { Image as ImageIcon } from 'lucide-react';
import { CoinLoader } from '@/components/ui/coin-loader';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Category {
  id: string;
  nameAr: string;
  nameFr: string;
}

interface ProductFormProps {
  initialData?: any;
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const t = useTranslations('admin');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>(initialData?.images || []);

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
    basePrice: initialData?.basePrice || '',
    stockQuantity: initialData?.stockQuantity || 0,
    categoryId: initialData?.categoryId || '',
    status: initialData?.status || 'ACTIVE',
    isFeatured: initialData?.isFeatured || false,
    isNew: initialData?.isNew || true,
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
    setImages(prev => [...prev, newMedia]);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData
        ? `/api/products/${initialData.id}`
        : '/api/products';

      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Auto-generate SKU and Slug
          sku: initialData?.sku || `SKU-${Date.now()}`,
          slug: generateSlug(formData.nameFr) || `product-${Date.now()}`,
          images: images.map(img => img.id),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">{t('basicInfo')}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('nameAr')}</label>
            <input
              type="text"
              name="nameAr"
              value={formData.nameAr}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Ø§ÙƒØªØ¨ Ø§Ù„Ø§Ø³Ù… Ù‡Ù†Ø§"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('nameFr')}</label>
            <input
              type="text"
              name="nameFr"
              value={formData.nameFr}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Entrez le nom ici"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('nameEn')}</label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Enter the name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('category')}</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 text-gray-900 bg-white"
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameFr} / {cat.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">{t('pricingInventory')}</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('priceUnit')}</label>
            <input
              type="number"
              step="0.001"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="e.g., 12.500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('stockQuantity')}</label>
            <input
              type="number"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="e.g., 25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('visibility')}</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'ACTIVE' }))}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${formData.status === 'ACTIVE'
                  ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-500 ring-offset-2'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${formData.status === 'ACTIVE' ? 'bg-white' : 'bg-green-500'}`} />
                  {t('showOnSite')}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: 'DRAFT' }))}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${formData.status === 'DRAFT' || formData.status === 'ARCHIVED'
                  ? 'bg-red-500 text-white shadow-lg ring-2 ring-red-500 ring-offset-2'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${formData.status === 'DRAFT' || formData.status === 'ARCHIVED' ? 'bg-white' : 'bg-red-500'}`} />
                  {t('hideFromSite')}
                </div>
              </button>
            </div>

            {/* If previously OUT OF STOCK, maintain warning */}
            {formData.status === 'OUT_OF_STOCK' && (
              <p className="mt-2 text-sm font-medium text-amber-600 bg-amber-50 p-2 rounded-md">
                Note: This product was marked as "Out of Stock". Clicking the green button will make it active and in stock on the site.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
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
                <span className="block text-base font-bold text-gray-900">{t('featuredProduct')}</span>
                <span className="block text-sm text-gray-500">{t('featuredDescription')}</span>
              </div>
            </label>

            <label
              className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.isNew
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
                }`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${formData.isNew ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                {formData.isNew && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="hidden"
              />
              <div>
                <span className="block text-base font-bold text-gray-900">{t('newArrival')}</span>
                <span className="block text-sm text-gray-500">{t('newArrivalDescription')}</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Descriptions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">{t('description')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('descriptionAr')}</label>
            <textarea
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Ø§ÙƒØªØ¨ Ø§Ù„ÙˆØµÙ Ù‡Ù†Ø§"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('descriptionFr')}</label>
            <textarea
              name="descriptionFr"
              value={formData.descriptionFr}
              onChange={handleChange}
              rows={4}
              required
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Entrez la description ici"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('descriptionEn')}</label>
            <textarea
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Enter the description here"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">{t('ingredients')}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('ingredientsAr')}</label>
            <textarea
              name="ingredientsAr"
              value={formData.ingredientsAr}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Ø§ÙƒØªØ¨ Ø§Ù„Ù…ÙƒÙˆÙ†Ø§Øª Ù‡Ù†Ø§"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('ingredientsFr')}</label>
            <textarea
              name="ingredientsFr"
              value={formData.ingredientsFr}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Entrez les ingrÃ©dients ici"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('ingredientsEn')}</label>
            <textarea
              name="ingredientsEn"
              value={formData.ingredientsEn}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full border rounded-md px-3 py-2 text-black bg-white placeholder-gray-400"
              placeholder="Enter ingredients here"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">{t('images')}</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square border rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={img.url}
                alt="Product"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Ã—
              </button>
            </div>
          ))}

          <div className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
            <MediaUpload onUploadComplete={handleImageUpload} />
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
          {initialData ? t('updateProduct') : t('createProduct')}
        </button>
      </div>
    </form>
  );
}
