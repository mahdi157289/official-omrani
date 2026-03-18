import { NextResponse } from 'next/server';
// Use dynamic import for prisma
import { generateOrderNumber } from '@/lib/utils';
import { clearCart } from '@/lib/cart-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, total, deliveryFee, sessionId, paymentMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber();

    const { prisma } = await import('@/lib/prisma');
    console.log('[API/Orders] Creating order for customer:', customer.email);

    // Find user if email exists (optional linking)
    const user = await prisma.user.findUnique({
      where: { email: customer.email },
    });

    // Create Order
    const orderItems = items.map((item: any) => {
      const isPackage = item.type === 'package';
      return {
        productId: isPackage ? null : item.productId,
        packageId: isPackage ? item.packageId : null,
        variantId: item.variantId || null,
        quantity: parseInt(item.quantity) || 1,
        unitPrice: Number(item.price),
        totalPrice: Number(item.total),
        variantNameAr: item.variantName || null,
      };
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        deliveryType: 'DELIVERY',
        deliveryAddress: `${customer.address}, ${customer.city}`,
        deliveryFee: Number(deliveryFee),
        subtotal: Number(total) - Number(deliveryFee),
        totalAmount: Number(total),
        paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
        status: 'PENDING',
        customerNotes: customer.notes,
        userId: user ? user.id : null,
        items: {
          create: orderItems,
        },
      },
    });

    console.log('[API/Orders] Order created successfully:', order.orderNumber);

    // Clear the cart
    if (sessionId) {
      clearCart(sessionId);
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const countOnly = searchParams.get('count') === 'true';

    const { prisma } = await import('@/lib/prisma');

    if (countOnly) {
      const count = await prisma.order.count({
        where: status ? { status: status as any } : {},
      });
      return NextResponse.json({ count });
    }

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

