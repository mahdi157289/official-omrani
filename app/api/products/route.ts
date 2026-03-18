import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      status: 'ACTIVE',
    };

    if (category) {
      where.categoryId = category;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: true,
        category: true,
        variants: {
          where: {
            isActive: true,
          },
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ products: [] });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      nameAr,
      nameFr,
      nameEn,
      descriptionAr,
      descriptionFr,
      descriptionEn,
      ingredientsAr,
      ingredientsFr,
      ingredientsEn,
      basePrice,
      stockQuantity,
      categoryId,
      images,
      sku,
      slug,
      isFeatured,
      isNew,
      status
    } = body;

    const product = await prisma.product.create({
      data: {
        nameAr,
        nameFr,
        nameEn,
        descriptionAr,
        descriptionFr,
        descriptionEn,
        ingredientsAr,
        ingredientsFr,
        ingredientsEn,
        basePrice: Number(basePrice),
        stockQuantity: Number(stockQuantity),
        categoryId,
        sku,
        slug,
        isFeatured: isFeatured || false,
        isNew: isNew || true,
        status: status || 'DRAFT',
        images: {
          connect: images?.map((id: string) => ({ id })) || [],
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
