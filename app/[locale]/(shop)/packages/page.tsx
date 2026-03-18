import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { SectionTitle } from '@/components/ui/section-title';
import { FadeIn } from '@/components/ui/fade-in';
import { GlassCard } from '@/components/ui/glass-card';
import { getTranslations } from 'next-intl/server';
import { AddToCartButton } from '@/components/add-to-cart-button';

async function getPackages() {
  return await prisma.package.findMany({
    where: {
      isActive: true,
    },
    include: {
      image: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  });
}

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const packages = await getPackages();
  const t = await getTranslations('common');

  return (
    <main className="min-h-screen bg-background pt-40 pb-12">
      <div className="w-[95%] max-w-7xl mx-auto">
        <GlassCard>
          <SectionTitle 
            title={locale === 'ar' ? 'باقات وعروض' : locale === 'fr' ? 'Packs & Offres' : 'Packages & Offers'}
          />

          {packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {locale === 'ar' ? 'لا توجد باقات متاحة حالياً' : locale === 'fr' ? 'Aucun pack disponible pour le moment' : 'No packages available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <FadeIn key={pkg.id} delay={index * 0.1}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative h-64 overflow-hidden">
                      {pkg.image ? (
                        <Image
                          src={pkg.image.url}
                          alt={
                            (locale === 'ar' ? pkg.image.altTextAr : 
                             locale === 'fr' ? pkg.image.altTextFr : 
                             pkg.image.altTextEn) || pkg.nameAr
                          }
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                      {pkg.isFeatured && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                          {locale === 'ar' ? 'مميز' : locale === 'fr' ? 'En Vedette' : 'Featured'}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {locale === 'ar' ? pkg.nameAr : locale === 'fr' ? pkg.nameFr : pkg.nameEn || pkg.nameFr}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {locale === 'ar' ? pkg.descriptionAr : locale === 'fr' ? pkg.descriptionFr : pkg.descriptionEn || pkg.descriptionFr}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          {pkg.discountPrice ? (
                            <>
                              <span className="text-gray-400 line-through text-sm">{Number(pkg.price).toFixed(3)} DT</span>
                              <span className="text-2xl font-bold text-primary">{Number(pkg.discountPrice).toFixed(3)} DT</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-primary">{Number(pkg.price).toFixed(3)} DT</span>
                          )}
                        </div>
                        
                        <AddToCartButton 
                          itemId={pkg.id}
                          type="package"
                          locale={locale}
                          className="w-auto bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors font-medium text-base shadow-none hover:shadow-none transform-none hover:scale-100"
                        />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </main>
  );
}
