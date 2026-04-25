import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy', {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    const { orderId, locale = 'ar' } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Fetch order from DB
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Determine currency and exchange rate based on locale
    let currency = 'tnd';
    let exchangeRate = 1;
    let multiplier = 1000; // TND uses 3 decimal places (millimes)

    if (locale === 'en') {
      currency = 'usd';
      multiplier = 100; // USD uses 2 decimal places (cents)
      const config = await prisma.siteConfig.findUnique({ where: { key: 'exchange_rate_usd' } });
      exchangeRate = parseFloat(config?.value || '0.32');
    } else if (locale === 'fr') {
      currency = 'eur';
      multiplier = 100; // EUR uses 2 decimal places (cents)
      const config = await prisma.siteConfig.findUnique({ where: { key: 'exchange_rate_eur' } });
      exchangeRate = parseFloat(config?.value || '0.30');
    }

    // Build line items for Stripe
    const lineItems = order.items.map((item) => {
      // Calculate unit amount in the target currency's smallest unit
      const unitPriceTnd = Number(item.unitPrice);
      const convertedPrice = unitPriceTnd * exchangeRate;
      const amountInSmallestUnit = Math.round(convertedPrice * multiplier);

      return {
        price_data: {
          currency: currency,
          product_data: {
            name: locale === 'ar' ? item.variantNameAr || 'منتج غير معروف' : item.variantNameFr || 'Produit Makroudh',
          },
          unit_amount: amountInSmallestUnit,
        },
        quantity: item.quantity,
      };
    });

    // Add Delivery Fee as a separate line item if > 0
    if (order.deliveryFee && Number(order.deliveryFee) > 0) {
      const deliveryFeeTnd = Number(order.deliveryFee);
      const convertedFee = deliveryFeeTnd * exchangeRate;
      const feeInSmallestUnit = Math.round(convertedFee * multiplier);

      lineItems.push({
        price_data: {
          currency: currency,
          product_data: {
            name: locale === 'en' ? 'Delivery Fee' : (locale === 'fr' ? 'Frais de livraison' : 'رسوم التوصيل'),
          },
          unit_amount: feeInSmallestUnit,
        },
        quantity: 1,
      });
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/${locale}/checkout/success?orderId=${order.orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/${locale}/checkout?canceled=true`,
      client_reference_id: order.id,
      customer_email: order.customerEmail,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        currency_used: currency,
        exchange_rate: exchangeRate.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
