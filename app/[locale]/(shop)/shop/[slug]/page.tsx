import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { formatPrice } from '@/lib/pricing';
import { LanguageSwitcher } from '@/components/language-switcher';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ProductSelection } from '@/components/product-selection';

async function getProduct(slug: string) {
  try {
    const { prisma } = await import('@/lib/prisma');
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        category: true,
        variants: {
          where: {
            isActive: true,
          },
          orderBy: {
            weight: 'asc',
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('product');

  const product = await getProduct(slug);

  if (!product || product.status !== 'ACTIVE') {
    notFound();
  }

  const name = locale === 'ar' ? product.nameAr : locale === 'fr' ? product.nameFr : product.nameEn || product.nameFr;
  const description = locale === 'ar' ? product.descriptionAr : locale === 'fr' ? product.descriptionFr : product.descriptionEn || product.descriptionFr;

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
        <GlassCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {product.images.length > 0 ? (
                <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].altTextAr || name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, idx) => (
                    <div key={idx} className="relative w-full h-20 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.altTextAr || name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-6 uppercase tracking-wider">{name}</h1>

                {product.comparePrice && product.comparePrice > product.basePrice && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl text-white/50 line-through decoration-red-500/50">
                      {formatPrice(product.comparePrice)}
                    </span>
                    <span className="px-2 py-1 bg-red-500 text-white rounded-md text-sm font-bold animate-pulse">
                      -{Math.round(((Number(product.comparePrice) - Number(product.basePrice)) / Number(product.comparePrice)) * 100)}%
                    </span>
                  </div>
                )}

                <div className="prose max-w-none mb-8">
                  <p className="text-white/90 text-lg leading-relaxed italic">{description}</p>
                </div>

                <ProductSelection
                  product={{
                    id: product.id,
                    basePrice: product.basePrice,
                    variants: product.variants.map(v => ({
                      id: v.id,
                      nameAr: v.nameAr,
                      nameFr: v.nameFr,
                      priceModifier: Number(v.priceModifier),
                      weight: v.weight
                    }))
                  }}
                  locale={locale}
                  t={{
                    selectWeight: t('selectWeight'),
                    addToCart: t('addToCart')
                  }}
                />

                {/* Product Details */}
                {(product.ingredientsAr || product.ingredientsFr) && (
                  <div className="mt-12 pt-8 border-t border-white/10">
                    <h3 className="font-bold text-xl mb-4 text-primary uppercase tracking-widest">
                      {locale === 'ar' ? 'المكونات' : locale === 'fr' ? 'Ingrédients' : 'Ingredients'}
                    </h3>
                    <p className="text-white/80 leading-relaxed text-lg">
                      {locale === 'ar' ? product.ingredientsAr : product.ingredientsFr}
                    </p>
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

