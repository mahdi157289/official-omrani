'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MediaUpload } from './media-upload';
import { X } from 'lucide-react';
import { CoinLoader } from '@/components/ui/coin-loader';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface CategoryFormProps {
    initialData?: any;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter();
    const t = useTranslations('admin');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<any>(initialData?.image || null);

    const [formData, setFormData] = useState({
        nameAr: initialData?.nameAr || '',
        nameFr: initialData?.nameFr || '',
        nameEn: initialData?.nameEn || '',
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                ? `/api/categories/${initialData.id}`
                : '/api/categories';
            const method = initialData ? 'PUT' : 'POST';

            const slug = generateSlug(formData.nameFr) || `cat-${Date.now()}`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    slug,
                    imageId: image?.id || null,
                    isActive: true, // Default to true as per simplified request
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to save category');
            }

            router.push('/admin/categories');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Error saving category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-6 rounded-lg shadow max-w-2xl"
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('nameFr')}
                        </label>
                        <input
                            type="text"
                            name="nameFr"
                            value={formData.nameFr}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 outline-none text-black bg-white"
                            placeholder="e.g. Makroudh Traditionnel"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                            {t('nameAr')}
                        </label>
                        <input
                            type="text"
                            name="nameAr"
                            value={formData.nameAr}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-md px-3 py-2 text-right focus:ring-2 focus:ring-primary/20 outline-none text-black bg-white"
                            dir="rtl"
                            placeholder="Ù…Ø«Ø§Ù„: Ù…Ù‚Ø±ÙˆØ¶ ØªÙ‚Ù„ÙŠØ¯ÙŠ"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('nameEn')}
                        </label>
                        <input
                            type="text"
                            name="nameEn"
                            value={formData.nameEn}
                            onChange={handleChange}
                            className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary/20 outline-none text-black bg-white"
                            placeholder="e.g. Traditional Makroudh"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('categoryPhoto')}
                    </label>
                    <div className="flex items-center gap-4">
                        {image ? (
                            <div className="relative w-32 h-32 border rounded-lg overflow-hidden group">
                                <Image
                                    src={image.url}
                                    alt="Category"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <MediaUpload onUploadComplete={handleImageUpload} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {t('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <CoinLoader className="w-4 h-4 animate-spin" wrapperClassName="contents" />}
                    {initialData ? t('updateCategory') : t('saveCategory')}
                </button>
            </div>
        </form>
    );
}
