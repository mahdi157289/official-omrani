import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.galleryItem.findUnique({
      where: { id },
      include: {
        media: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
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
      titleAr,
      titleFr,
      descriptionAr,
      descriptionFr,
      mediaId,
      isActive,
      displayOrder
    } = body;

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        titleAr,
        titleFr,
        descriptionAr,
        descriptionFr,
        mediaId,
        isActive,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
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
    await prisma.galleryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
