// Removed static prisma import to use dynamic import for better error isolation
import Image from 'next/image';
import { SectionTitle } from '@/components/ui/section-title';
import { FadeIn } from '@/components/ui/fade-in';
import { GlassCard } from '@/components/ui/glass-card';

async function getGalleryItems() {
  try {
    const { prisma } = await import('@/lib/prisma');
    return await prisma.galleryItem.findMany({
      where: {
        isActive: true,
      },
      include: {
        media: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }
}

export async function GallerySection({ locale }: { locale: string }) {
  const items = await getGalleryItems();

  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="w-[95%] max-w-7xl mx-auto">
        <GlassCard>
          <SectionTitle
            title={locale === 'ar' ? 'الوسائط والقصص' : locale === 'fr' ? 'Médias & Histoires' : 'Media & Stories'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {items.map((item, index) => (
              <FadeIn
                key={item.id}
                delay={index * 0.1}
                className={`relative rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 gold-border ${index % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
              >
                <Image
                  src={item.media.url}
                  alt={
                    (locale === 'ar' ? item.titleAr :
                      locale === 'fr' ? item.titleFr :
                        item.titleAr) || 'Gallery Image'
                  }
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-xl font-bold mb-1">
                    {locale === 'ar' ? item.titleAr : locale === 'fr' ? item.titleFr : item.titleAr}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {locale === 'ar' ? item.descriptionAr : locale === 'fr' ? item.descriptionFr : item.descriptionAr}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
