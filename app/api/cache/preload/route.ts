import { NextRequest, NextResponse } from 'next/server';
import { getCache, setCache, preloadAndCache } from '@/lib/redis-cache';

/**
 * Preload API Endpoint
 * Preloads critical resources during splash screen
 */

// Cache keys
const CACHE_KEYS = {
  featuredProducts: 'products:featured',
  packages: 'packages:all',
  heroImage: 'images:hero',
};

/**
 * GET /api/cache/preload
 * Preloads data and returns cached results
 */
export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 'default';
  const resource = request.nextUrl.searchParams.get('resource');

  try {
    switch (resource) {
      case 'products': {
        const cached = await getCache(sessionId, CACHE_KEYS.featuredProducts);
        if (cached) {
          return NextResponse.json({ cached: true, data: cached });
        }

        // Fetch products
        const { prisma } = await import('@/lib/prisma');
        const products = await prisma.product.findMany({
          where: {
            status: 'ACTIVE',
            isFeatured: true,
          },
          include: {
            images: { take: 1 },
            category: true,
            variants: {
              where: { isActive: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 8,
        });

        const formatted = products.map((p) => ({
          ...p,
          basePrice: Number(p.basePrice),
          comparePrice: p.comparePrice ? Number(p.comparePrice) : null,
          costPrice: p.costPrice ? Number(p.costPrice) : null,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
          publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
          variants: p.variants.map((v) => ({
            ...v,
            priceModifier: Number(v.priceModifier),
          })),
        }));

        await setCache(sessionId, CACHE_KEYS.featuredProducts, formatted);
        return NextResponse.json({ cached: false, data: formatted });
      }

      case 'packages': {
        const cached = await getCache(sessionId, CACHE_KEYS.packages);
        if (cached) {
          return NextResponse.json({ cached: true, data: cached });
        }

        // Fetch packages
        const { prisma } = await import('@/lib/prisma');
        const packages = await prisma.package.findMany({
          where: { isActive: true },
          include: { image: true },
          orderBy: { displayOrder: 'asc' },
        });

        await setCache(sessionId, CACHE_KEYS.packages, packages);
        return NextResponse.json({ cached: false, data: packages });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid resource' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Preload error:', error);
    return NextResponse.json(
      { error: 'Failed to preload resource' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cache/preload
 * Preloads multiple resources in parallel
 */
export async function POST(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 'default';
  const body = await request.json();
  const resources = body.resources || ['products', 'packages'];

  try {
    const results: Record<string, any> = {};

    // Preload in parallel
    const promises = resources.map(async (resource: string) => {
      const url = new URL('/api/cache/preload', request.url);
      url.searchParams.set('resource', resource);

      const response = await fetch(url.toString(), {
        headers: {
          'x-session-id': sessionId,
        },
      });

      const data = await response.json();
      results[resource] = data;
    });

    await Promise.allSettled(promises);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Batch preload error:', error);
    return NextResponse.json(
      { error: 'Failed to preload resources' },
      { status: 500 }
    );
  }
}
