import { requireAdmin } from '@/lib/auth-helpers';
import { GalleryForm } from '@/components/admin/gallery-form';

export default async function NewGalleryItemPage() {


  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Gallery Item</h1>
      <GalleryForm />
    </div>
  );
}
