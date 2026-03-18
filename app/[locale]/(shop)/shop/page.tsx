import { getTranslations } from 'next-intl/server';
import { ProductCard } from '@/components/product-card';
import { PackageCard } from '@/components/package-card';
import { ShopFilters } from '@/components/shop-filters';
import { ShopLayoutClient } from '@/components/shop-layout-client';

async function getStoreItems(search?: string, categorySlug?: string, minPrice?: number, maxPrice?: number, type?: string) {
  try {
    const { prisma } = await import('@/lib/prisma');

    const productWhere: any = { status: 'ACTIVE' };
    const packageWhere: any = { isActive: true };

    if (search) {
      const searchClause = {
        OR: [
          { nameEn: { contains: search } },
          { nameFr: { contains: search } },
          { nameAr: { contains: search } },
          { descriptionEn: { contains: search } },
          { descriptionFr: { contains: search } },
          { descriptionAr: { contains: search } },
        ]
      };
      productWhere.AND = [searchClause];
      packageWhere.AND = [searchClause];
    }

    if (categorySlug) {
      productWhere.category = { slug: categorySlug };
      // Packages don't have categories in this schema, so if category is filtered, maybe packages should be excluded?
      // Actually, if a specific category is selected, we only show products.
    }

    const productMin = minPrice !== undefined ? { gte: minPrice } : {};
    const productMax = maxPrice !== undefined ? { lte: maxPrice } : {};
    if (minPrice !== undefined || maxPrice !== undefined) {
      productWhere.basePrice = { ...productMin, ...productMax };
      packageWhere.price = { ...productMin, ...productMax };
    }

    let products: any[] = [];
    let packages: any[] = [];

    if (!type || type === 'product') {
      products = await prisma.product.findMany({
        where: productWhere,
        include: {
          images: { take: 1 },
          category: true,
          variants: { where: { isActive: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!type || type === 'package') {
      // Only fetch packages if no category is selected (as per current schema)
      if (!categorySlug) {
        packages = await prisma.package.findMany({
          where: packageWhere,
          include: { image: true },
          orderBy: { displayOrder: 'asc' },
        });
      }
    }

    // Tag them so we can Distinguish
    const items = [
      ...products.map(p => ({ ...p, storeType: 'product' })),
      ...packages.map(p => ({ ...p, storeType: 'package' }))
    ];

    // Sort by date or relevance
    return items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  } catch (error) {
    console.error('Store fetch error:', error);
    return [];
  }
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ search?: string; category?: string; minPrice?: string; maxPrice?: string; type?: string }>;
}) {
  const { locale } = await params;
  const { search, category, minPrice, maxPrice, type } = await searchParams;
  const t = await getTranslations('common');

  const { prisma } = await import('@/lib/prisma');
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, nameAr: true, nameFr: true, nameEn: true },
    orderBy: { displayOrder: 'asc' }
  }).catch(() => []);

  const parsedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
  const parsedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

  const items = await getStoreItems(search, category, parsedMinPrice, parsedMaxPrice, type);

  const serializedItems = items.map(item => {
    if (item.storeType === 'product') {
      return {
        ...item,
        basePrice: Number(item.basePrice),
        comparePrice: item.comparePrice ? Number(item.comparePrice) : null,
        costPrice: item.costPrice ? Number(item.costPrice) : null,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        variants: item.variants.map((v: any) => ({
          ...v,
          priceModifier: Number(v.priceModifier),
          createdAt: v.createdAt.toISOString(),
          updatedAt: v.updatedAt.toISOString(),
        }))
      };
    } else {
      return {
        ...item,
        price: Number(item.price),
        discountPrice: item.discountPrice ? Number(item.discountPrice) : null,
        createdAt: (item as any).createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: (item as any).updatedAt?.toISOString() || new Date().toISOString(),
      };
    }
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="w-[95%] max-w-7xl mx-auto pt-40 pb-8">
        <h1 className="text-4xl font-bold text-[#437983] mb-8 text-center uppercase tracking-widest px-4 py-2 border-b-2 border-[#D4AF37]/30 w-fit mx-auto">
          {t('shop')}
        </h1>

        <ShopLayoutClient
          locale={locale}
          sidebar={<ShopFilters categories={categories as any} locale={locale} />}
        >
          {serializedItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                {t('noResults')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {serializedItems.map((item: any) => (
                item.storeType === 'product' ? (
                  <ProductCard key={item.id} product={item} locale={locale} />
                ) : (
                  <PackageCard key={item.id} pkg={item} locale={locale} />
                )
              ))}
            </div>
          )}
        </ShopLayoutClient>
      </div>
    </main>
  );
}

