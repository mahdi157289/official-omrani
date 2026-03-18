import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma'; // Ensure correct import for your prisma setup

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy', {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Attempt to dynamically import prisma just in case to match other routes
    const { prisma: db } = await import('@/lib/prisma');

    // Fetch order from DB
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Build line items for Stripe
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd', // or 'eur', 'dt' depending on your Stripe account. Assuming usd/eur for Stripe.
        product_data: {
          name: item.variantNameAr || item.variantNameFr || 'Makroudh Product',
        },
        unit_amount: Math.round(Number(item.unitPrice) * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Add Delivery Fee as a separate line item if > 0
    if (order.deliveryFee && Number(order.deliveryFee) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Delivery Fee',
          },
          unit_amount: Math.round(Number(order.deliveryFee) * 100),
        },
        quantity: 1,
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/en/checkout/success?orderId=${order.orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/en/checkout?canceled=true`,
      client_reference_id: order.id,
      customer_email: order.customerEmail,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
