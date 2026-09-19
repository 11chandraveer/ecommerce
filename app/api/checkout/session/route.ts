import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderPayment } from '@/lib/api-store';

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session_id');
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payment session is unavailable.' }, { status: 400 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment has not been completed.' }, { status: 402 });
    }
    updateOrderPayment(session.id, 'confirmed');
    return NextResponse.json({ paid: true, orderId: session.metadata?.orderId ?? null });
  } catch {
    return NextResponse.json({ error: 'Could not verify payment.' }, { status: 400 });
  }
}
