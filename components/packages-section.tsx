// Removed static prisma import to use dynamic import for consistency
import Image from 'next/image';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/section-title';
import { FadeIn } from '@/components/ui/fade-in';
import { GlassCard } from '@/components/ui/glass-card';
import { getTranslations } from 'next-intl/server';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { formatPrice } from '@/lib/utils';
import { Eye, Ear, ShoppingCart } from 'lucide-react';
import { getServerSessionId } from '@/lib/get-session-id';
import { getCache, setCache } from '@/lib/redis-cache';

async function getPackages(sessionId?: string) {
  try {
    // Try to get from cache first
    if (sessionId) {
      const cached = await getCache(sessionId, 'packages:all');
      if (cached) {
        return cached;
      }
    }

    // Fetch from database
    const { prisma } = await import('@/lib/prisma');
    const packages = await prisma.package.findMany({
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

    // Cache the results
    if (sessionId) {
      await setCache(sessionId, 'packages:all', packages);
    }

    console.log('Fetched packages count:', packages.length);
    return packages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    return [];
  }
}

export async function PackagesSection({ 
  locale
}: { 
  locale: string;
}) {
  const sessionId = await getServerSessionId();
  const packages = await getPackages(sessionId);

  // Use a try-catch for translations to prevent entire section crash
  let t;
  try {
    t = await getTranslations('common');
  } catch (e) {
    t = (key: string) => key;
  }

  if (packages.length === 0) {
    return (
      <div className="w-full">
        <GlassCard>
          <SectionTitle
            title={locale === 'ar' ? 'باقات وعروض' : locale === 'fr' ? 'Packs & Offres' : 'Packages & Offers'}
          />
          <div className="text-center py-12">
            <p className="text-white/50 text-lg italic">
              {locale === 'ar' ? 'لا توجد باقات متاحة حالياً' : locale === 'fr' ? 'Aucun pack disponible' : 'No packages available'}
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-[95%] max-w-7xl mx-auto">
      <GlassCard>
        <SectionTitle
          title={locale === 'ar' ? 'باقات وعروض' : locale === 'fr' ? 'Packs & Offres' : 'Packages & Offers'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <FadeIn key={pkg.id} delay={index * 0.1}>
              <div className="bg-[#F2C782] rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 gold-border">
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
                  <div className="absolute top-0 right-0 h-full w-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-40 pointer-events-none group-hover:pointer-events-auto">
                    <div className="flex flex-col gap-3 mr-4">
                      <Link
                        href={`/${locale}/packages/${pkg.slug}`}
                        className="w-11 h-11 rounded-full bg-white text-gray-900 shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                        aria-label="View package"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        type="button"
                        className="w-11 h-11 rounded-full bg-white text-gray-900 shadow-xl hover:bg-primary hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                        aria-label="Hear package"
                      >
                        <Ear className="w-5 h-5" />
                      </button>
                      <AddToCartButton
                        itemId={pkg.id}
                        type="package"
                        locale={locale}
                        compact={true}
                        className="w-11 h-11 rounded-full bg-secondary text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                      />
                    </div>
                  </div>
                  {pkg.isFeatured && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                      {locale === 'ar' ? 'مميز' : locale === 'fr' ? 'En Vedette' : 'Featured'}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center min-h-[4rem] items-center flex justify-center">
                    {locale === 'ar' ? pkg.nameAr : locale === 'fr' ? pkg.nameFr : pkg.nameEn || pkg.nameFr}
                  </h3>

                  {/* Separator */}
                  <div className="w-16 h-1 bg-[#346977] mx-auto mb-4 rounded-full opacity-60" />

                  <p className="text-lg text-black mb-4 line-clamp-3 text-center leading-relaxed">
                    {locale === 'ar' ? pkg.descriptionAr : locale === 'fr' ? pkg.descriptionFr : pkg.descriptionEn || pkg.descriptionFr}
                  </p>

                  {((pkg as any).ingredientsAr || (pkg as any).ingredientsFr) && (
                    <p className="text-sm font-semibold text-primary mb-6 line-clamp-2 text-center">
                      {((locale === 'ar' ? ((pkg as any).ingredientsAr || (pkg as any).ingredientsFr) : ((pkg as any).ingredientsFr || (pkg as any).ingredientsAr)) || '')
                        .split('\n')
                        .filter((line: string) => line.trim())
                        .join(' • ')}
                    </p>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-baseline justify-between mb-4">
                      {pkg.discountPrice ? (
                        <>
                          <span className="text-gray-400 line-through text-base">{formatPrice(pkg.price)}</span>
                          <span className="text-3xl font-bold text-primary">{formatPrice(pkg.discountPrice)}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-primary">{formatPrice(pkg.price)}</span>
                      )}
                    </div>
                    <AddToCartButton
                      itemId={pkg.id}
                      type="package"
                      locale={locale}
                      className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-primary transition-colors"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
