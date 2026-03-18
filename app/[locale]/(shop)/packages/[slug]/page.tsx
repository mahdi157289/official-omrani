import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/pricing';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { GlassCard } from '@/components/ui/glass-card';

async function getPackage(slug: string) {
  try {
    const { prisma } = await import('@/lib/prisma');
    return await prisma.package.findUnique({
      where: { slug },
      include: { image: true },
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    return null;
  }
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('common');

  const pkg = await getPackage(slug);

  if (!pkg || !pkg.isActive) {
    notFound();
  }

  const name = locale === 'ar' ? pkg.nameAr : locale === 'fr' ? pkg.nameFr : pkg.nameEn || pkg.nameFr;
  const description = locale === 'ar' ? pkg.descriptionAr : locale === 'fr' ? pkg.descriptionFr : pkg.descriptionEn || pkg.descriptionFr;
  const price = pkg.discountPrice ? Number(pkg.discountPrice) : Number(pkg.price);

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
        <GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Package Image */}
            <div className="space-y-4">
              <div className="relative w-full h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl gold-border-heavy">
                {pkg.image ? (
                  <Image
                    src={pkg.image.url}
                    alt={
                      (locale === 'ar'
                        ? pkg.image.altTextAr
                        : locale === 'fr'
                          ? pkg.image.altTextFr
                          : pkg.image.altTextEn) || name
                    }
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Package Info */}
            <div className="space-y-8 py-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wider leading-tight">
                  {name}
                </h1>

                {pkg.discountPrice && pkg.discountPrice < pkg.price && (
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl text-white/40 line-through decoration-red-500/50">
                      {formatPrice(Number(pkg.price))}
                    </span>
                    <span className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-black animate-pulse shadow-lg">
                      -{Math.round(((Number(pkg.price) - Number(pkg.discountPrice)) / Number(pkg.price)) * 100)}%
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-6 mb-10">
                  <span className="text-4xl font-black text-amber-500 drop-shadow-sm">
                    {formatPrice(price)}
                  </span>
                </div>

                <div className="prose max-w-none mb-10">
                  <p className="text-white/90 text-xl leading-relaxed italic border-l-4 border-amber-500 pl-6 py-2 bg-white/5 rounded-r-xl">
                    {description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <AddToCartButton
                    itemId={pkg.id}
                    type="package"
                    locale={locale}
                    className="w-full sm:w-auto px-10 py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl gold-border"
                  />
                  <div className="w-full sm:w-auto">
                    <Link
                      href={`/${locale}`}
                      className="inline-flex w-full justify-center px-10 py-4 rounded-xl border-2 border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
                    >
                      {locale === 'ar' ? 'العودة' : locale === 'fr' ? 'Retour' : 'Back'}
                    </Link>
                  </div>
                </div>

                {/* Pack Contents */}
                {(pkg.ingredientsAr || pkg.ingredientsFr || (pkg as any).ingredientsEn) && (
                  <div className="mt-16 pt-10 border-t border-white/10">
                    <h3 className="font-black text-2xl mb-6 text-amber-500 uppercase tracking-widest flex items-center gap-3">
                      <span className="w-8 h-1 bg-amber-500 rounded-full" />
                      {locale === 'ar' ? 'محتوى الباقة' : locale === 'fr' ? 'Contenu du Pack' : 'What\'s Inside'}
                    </h3>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                      <ul className="space-y-3">
                        {((locale === 'ar'
                          ? (pkg.ingredientsAr || pkg.ingredientsFr || (pkg as any).ingredientsEn)
                          : locale === 'fr'
                            ? (pkg.ingredientsFr || pkg.ingredientsAr || (pkg as any).ingredientsEn)
                            : ((pkg as any).ingredientsEn || pkg.ingredientsFr || pkg.ingredientsAr)) || '')
                          .split('\n')
                          .filter((line: string) => line.trim())
                          .map((line: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-white/85 text-lg">
                              <span className="text-amber-500 mt-1 text-xl font-bold flex-shrink-0">✦</span>
                              <span className="leading-relaxed">{line.trim()}</span>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
