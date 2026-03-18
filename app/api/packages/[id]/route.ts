import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        image: true,
      },
    });

    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pkg);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        nameAr,
        nameFr,
        nameEn,
        slug,
        descriptionAr: descriptionAr !== undefined ? descriptionAr : undefined,
        descriptionFr: descriptionFr !== undefined ? descriptionFr : undefined,
        descriptionEn: descriptionEn !== undefined ? descriptionEn : undefined,
        ingredientsAr: ingredientsAr !== undefined ? ingredientsAr : undefined,
        ingredientsFr: ingredientsFr !== undefined ? ingredientsFr : undefined,
        ingredientsEn: ingredientsEn !== undefined ? ingredientsEn : undefined,
        price: price ? Number(price) : undefined,
        discountPrice: discountPrice ? Number(discountPrice) : null,
        imageId,
        isFeatured,
        isActive,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
      },
    });

    return NextResponse.json(pkg);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Failed to update package' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      { error: 'Failed to delete package' },
      { status: 500 }
    );
  }
}
