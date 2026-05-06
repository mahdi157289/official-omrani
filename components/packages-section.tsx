// Removed static prisma import to use dynamic import for consistency
import { SectionTitle } from '@/components/ui/section-title';
import { GlassCard } from '@/components/ui/glass-card';
import { getTranslations } from 'next-intl/server';
import { getServerSessionId } from '@/lib/get-session-id';
import { getCache, setCache } from '@/lib/redis-cache';
import { PackagesCarousel } from './packages-carousel';

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

        <PackagesCarousel locale={locale} packages={packages} />
      </GlassCard>
    </div>
  );
}
