import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { prisma } = await import('@/lib/prisma');

    const url = new URL(request.url);
    const isAdmin = url.searchParams.get('admin') === 'true';

    const whereClause = isAdmin ? {} : { isActive: true };

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: {
        image: true,
        _count: {
          select: {
            products: {
              where: {
                status: 'ACTIVE',
              },
            },
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return empty array if database not set up
    return NextResponse.json({ categories: [] });
  }
}

export async function POST(request: Request) {
  try {
    const { prisma } = await import('@/lib/prisma');
    const body = await request.json();

    const {
      nameAr,
      nameFr,
      nameEn,
      slug,
      descriptionAr,
      descriptionFr,
      descriptionEn,
      isActive,
      isFeatured,
      imageId,
    } = body;

    const category = await prisma.category.create({
      data: {
        nameAr,
        nameFr,
        nameEn,
        slug,
        descriptionAr,
        descriptionFr,
        descriptionEn,
        isActive: isActive === undefined ? true : isActive,
        isFeatured: isFeatured || false,
        imageId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

