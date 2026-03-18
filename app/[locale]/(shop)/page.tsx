import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/language-switcher';
import Link from 'next/link';
import Image from 'next/image';
import { FeaturedProducts } from '@/components/featured-products';
import { PackagesSection } from '@/components/packages-section';
import { GallerySection } from '@/components/gallery-section';
import { SectionTitle } from '@/components/ui/section-title';
import { FadeIn } from '@/components/ui/fade-in';
import { GlassCard } from '@/components/ui/glass-card';
import { HeroSlideshow } from '@/components/hero-slideshow';
import { SectionWrapper } from '@/components/ui/section-wrapper';
import { LocationSection } from '@/components/location-section';
import { getServerSessionId } from '@/lib/get-session-id';

async function getFeaturedProducts(sessionId?: string) {
  try {
    // Try to get from cache first
    if (sessionId) {
      const { getCache, setCache } = await import('@/lib/redis-cache');
      const cached = await getCache(sessionId, 'products:featured');
      if (cached) {
        return cached;
      }
    }

    // Fetch from database
    const { prisma } = await import('@/lib/prisma');
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        isFeatured: true,
      },
      include: {
        images: {
          take: 1,
        },
        category: true,
        variants: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    });

    // Cache the results
    if (sessionId) {
      const { setCache } = await import('@/lib/redis-cache');
      const formatted = products.map(p => ({
        ...p,
        basePrice: Number(p.basePrice),
        comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
        costPrice: p.costPrice ? Number(p.costPrice) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
        variants: p.variants.map(v => ({
          ...v,
          priceModifier: Number(v.priceModifier)
        }))
      }));
      await setCache(sessionId, 'products:featured', formatted);
      return formatted;
    }

    return products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sessionId = await getServerSessionId();
  const t = await getTranslations('home');
  const rawProducts = (await getFeaturedProducts(sessionId)) as any[];
  
  // If products are already formatted (from cache), use them directly
  const featuredProducts =
    rawProducts.length > 0 &&
    'basePrice' in rawProducts[0] &&
    typeof (rawProducts[0] as any).basePrice === 'number'
    ? rawProducts
      : rawProducts.map((p: any) => ({
    ...p,
    basePrice: Number(p.basePrice),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
    costPrice: p.costPrice ? Number(p.costPrice) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
          variants: p.variants.map((v: any) => ({
      ...v,
            priceModifier: Number(v.priceModifier),
          })),
  }));

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="home" className="relative block w-full p-0 mt-[96px] md:mt-[72px] mb-0 leading-[0] overflow-hidden">
        <img
          src="/media/images/background-image.jpg"
          alt="Hero"
          className="w-full h-auto block"
        />

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/80">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Section */}
      <SectionWrapper id="featured" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle
            title={t('featuredTitle')}
          />
          <FadeIn delay={0.2}>
            <FeaturedProducts locale={locale} products={featuredProducts} />
          </FadeIn>
        </div>
      </SectionWrapper>

      {/* Packages Section */}
      <SectionWrapper id="packages">
        <PackagesSection locale={locale} />
      </SectionWrapper>

      {/* Location Section */}
      <SectionWrapper id="location" className="py-24 bg-background">
        <LocationSection locale={locale} />
      </SectionWrapper>

      {/* Gallery Section */}
      <SectionWrapper id="gallery">
        <GallerySection locale={locale} />
      </SectionWrapper>

      {/* About Section */}
      <SectionWrapper id="about" className="py-24 bg-background overflow-hidden">
        <div className="w-[95%] max-w-7xl mx-auto">
          <GlassCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <FadeIn direction="right">
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl gold-border">
                  <Image
                    src="/media/images/omranis-1.jpg"
                    alt={t('makroudhAlt') || t('title')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.2}>
                <div>
                  <SectionTitle
                    align="left"
                    title={t('ourStory')}
                    className="mb-8"
                  />
                  <p className="text-gray-300 text-lg mb-6 leading-relaxed font-light">
                    {t('storyContent')}
                  </p>
                  <Link
                    href={`/${locale}/about`}
                    className="inline-flex items-center gap-2 text-secondary-light font-bold hover:text-white transition-colors group text-lg"
                  >
                    {t('learnMore')}
                    <span className="transform transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
                  </Link>
                </div>
              </FadeIn>
            </div>
          </GlassCard>
        </div>
      </SectionWrapper>


    </main>
  );
}
