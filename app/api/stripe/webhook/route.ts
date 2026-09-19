import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderPayment } from '@/lib/api-store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      updateOrderPayment(session.id, 'confirmed');
    }
    if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      updateOrderPayment(session.id, 'cancelled');
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Invalid Stripe webhook:', error);
    return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 400 });
  }
}
