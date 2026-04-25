import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';

export async function GET() {
  try {
    await requireAdmin();
    const { prisma } = await import('@/lib/prisma');

    const [pendingCount, recentPending] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.findMany({
        where: { status: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          customerPhone: true,
          deliveryAddress: true,
          totalAmount: true,
          createdAt: true,
          customerNotes: true,
        },
      }),
    ]);

    return NextResponse.json({ count: pendingCount, orders: recentPending });
  } catch (error: any) {
    if (error?.message?.includes('Unauthorized') || error?.message?.includes('Admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
