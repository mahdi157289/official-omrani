import { NextResponse } from 'next/server';
// Use dynamic import for prisma
import { requireAdmin } from '@/lib/auth-helpers';

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
    const { status, paymentStatus } = body;

    const updateData: any = {};

    if (status) {
      updateData.status = status;
      if (status === 'DELIVERED') {
        updateData.deliveredAt = new Date();
      } else if (status === 'CANCELLED') {
        updateData.cancelledAt = new Date();
      } else if (status === 'CONFIRMED') {
        updateData.confirmedAt = new Date();
      }
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const { prisma } = await import('@/lib/prisma');
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
