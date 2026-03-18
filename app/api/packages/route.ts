import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');

    const where: any = {};

    if (active === 'true') {
      where.isActive = true;
    }

    const packages = await prisma.package.findMany({
      where,
      include: {
        image: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ packages: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      nameAr,
      nameFr,
      nameEn,
      slug,
      descriptionAr,
      descriptionFr,
      descriptionEn,
      ingredientsAr,
      ingredientsFr,
      ingredientsEn,
      price,
      discountPrice,
      imageId,
      isFeatured,
      isActive,
      displayOrder
    } = body;

    const pkg = await prisma.package.create({
      data: {
        nameAr,
        nameFr,
        nameEn,
        slug,
        descriptionAr,
        descriptionFr,
        descriptionEn,
        ingredientsAr,
        ingredientsFr,
        ingredientsEn,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        imageId,
        isFeatured: isFeatured || false,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
      },
    });

    return NextResponse.json(pkg);
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}
