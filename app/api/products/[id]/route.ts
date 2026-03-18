import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
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

    // Disconnect existing images if updated
    if (images) {
      await prisma.product.update({
        where: { id },
        data: {
          images: {
            set: [],
          },
        },
      });
    }

    const product = await prisma.product.update({
      where: { id },
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
        isFeatured,
        isNew,
        status,
        ...(images && {
          images: {
            connect: images.map((imgId: string) => ({ id: imgId })),
          },
        }),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
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
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
