import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/api-store';
import Stripe from 'stripe';
import { coupons, products } from '@/lib/data';

type CheckoutBody = {
  email?: string;
  couponCode?: string;
  items?: Array<{ productId?: string; quantity?: number }>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CheckoutBody;
  const items = (body.items ?? []).map((item) => ({
    productId: item.productId ?? '',
    quantity: Number(item.quantity ?? 0),
  }));

  if (!body.email || items.length === 0 || items.some((item) => !item.productId || item.quantity < 1)) {
    return NextResponse.json({ error: 'A valid email and cart are required.' }, { status: 400 });
  }

  const lineItems = items.map((item) => ({
    item,
    product: products.find((entry) => entry.id === item.productId),
  }));

  if (lineItems.some(({ product }) => !product)) {
    return NextResponse.json({ error: 'One or more products are no longer available.' }, { status: 400 });
  }

  const subtotal = lineItems.reduce((sum, { product, item }) => sum + product!.price * item.quantity, 0);
  const coupon = body.couponCode ? coupons.find((entry) => entry.code === body.couponCode && entry.active) : undefined;
  const discount = coupon && subtotal >= coupon.minOrder
    ? coupon.type === 'percentage' ? Math.round(subtotal * coupon.value / 100) : Math.min(coupon.value, subtotal)
    : 0;

  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';
    const eligibleCoupon = coupon && discount > 0 ? coupon : undefined;
    const stripeCoupon = eligibleCoupon
      ? await stripe.coupons.create(eligibleCoupon.type === 'percentage'
        ? { percent_off: eligibleCoupon.value, duration: 'once' }
        : { amount_off: Math.round(eligibleCoupon.value * 100), currency: 'usd', duration: 'once' })
      : undefined;
    const tax = Math.round(Math.max(0, subtotal - discount) * 0.08 * 100);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: body.email,
      line_items: [
        ...lineItems.map(({ product, item }) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd' as const,
            unit_amount: Math.round(product!.price * 100),
            product_data: { name: product!.name, images: [product!.image] },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: 'usd' as const,
            unit_amount: tax,
            product_data: { name: 'Estimated tax' },
          },
        },
      ],
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1200, currency: 'usd' },
          display_name: 'Standard shipping',
        },
      }],
      discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : undefined,
      success_url: `${origin}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?payment=cancelled`,
      metadata: { items: JSON.stringify(items), coupon: coupon?.code ?? '', discount: String(discount) },
    });

    return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id, provider: 'stripe' }, { status: 201 });
  }

  const order = createOrder({ email: body.email, items });
  return NextResponse.json({ order }, { status: 201 });
}
