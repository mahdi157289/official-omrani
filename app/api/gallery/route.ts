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

    const items = await prisma.galleryItem.findMany({
      where,
      include: {
        media: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json({ items: [] }, { status: 500 });
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
      titleAr,
      titleFr,
      descriptionAr,
      descriptionFr,
      mediaId,
      isActive,
      displayOrder
    } = body;

    const item = await prisma.galleryItem.create({
      data: {
        titleAr,
        titleFr,
        descriptionAr,
        descriptionFr,
        mediaId,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder ? Number(displayOrder) : 0,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}
