import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy', {
  apiVersion: '2024-06-20' as any,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!endpointSecret) {
      console.warn('Stripe endpoint secret is not set.');
    }

    let event;

    if (endpointSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
      } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // For local testing without a proper webhook secret or signature
      event = JSON.parse(rawBody);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      const paymentIntent = session.payment_intent as string; // String or Object depending on expansion

      if (orderId) {
        const { prisma } = await import('@/lib/prisma');
        
        // Update the order in the database
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            paymentReference: paymentIntent || session.id, // Store Intent or Session ID
            status: 'CONFIRMED' // Or keep it pending based on your fulfillment workflow
          },
        });
        
        console.log(`[Webhooks] Order ${orderId} marked as PAID via session ${session.id}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Stripe Webhook Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
