import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/api-store';
import Stripe from 'stripe';
import { coupons, products } from '@/lib/data';

type CheckoutBody = {
  email?: string;
  couponCode?: string;
  items?: Array<{ productId?: string; quantity?: number }>;
};

const appUrl = () => process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CheckoutBody;
  const email = body.email?.trim().toLowerCase();
  const items = (body.items ?? []).map((item) => ({
    productId: item.productId ?? '',
    quantity: Number(item.quantity ?? 0),
  }));

  if (!email || !/^\S+@\S+\.\S+$/.test(email) || items.length === 0 || items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity < 1)) {
    return NextResponse.json({ error: 'A valid email and cart are required.' }, { status: 400 });
  }

  const lineItems = items.map((item) => ({ item, product: products.find((entry) => entry.id === item.productId) }));
  if (lineItems.some(({ product }) => !product)) {
    return NextResponse.json({ error: 'One or more products are no longer available.' }, { status: 400 });
  }
  if (lineItems.some(({ item, product }) => item.quantity > product!.stock)) {
    return NextResponse.json({ error: 'One or more products do not have enough stock.' }, { status: 400 });
  }

  const subtotal = lineItems.reduce((sum, { product, item }) => sum + product!.price * item.quantity, 0);
  const coupon = body.couponCode
    ? coupons.find((entry) => entry.code.toLowerCase() === body.couponCode!.trim().toLowerCase() && entry.active)
    : undefined;
  const discount = coupon && subtotal >= coupon.minOrder
    ? coupon.type === 'percentage' ? Math.round(subtotal * coupon.value / 100) : Math.min(coupon.value, subtotal)
    : 0;
  const shipping = 12;
  const tax = Math.round(Math.max(0, subtotal - discount) * 0.08);
  const total = subtotal - discount + shipping + tax;

  if (!process.env.STRIPE_SECRET_KEY) {
    const order = createOrder({ email, items, total, paymentProvider: 'demo' });
    return NextResponse.json({ order, provider: 'demo' }, { status: 201 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const order = createOrder({ email, items, total, status: 'pending', paymentProvider: 'stripe' });
    const eligibleCoupon = coupon && discount > 0 ? coupon : undefined;
    const stripeCoupon = eligibleCoupon
      ? await stripe.coupons.create(eligibleCoupon.type === 'percentage'
        ? { percent_off: eligibleCoupon.value, duration: 'once' }
        : { amount_off: Math.round(eligibleCoupon.value * 100), currency: 'usd', duration: 'once' })
      : undefined;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        ...lineItems.map(({ product, item }) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'usd' as const,
            unit_amount: Math.round(product!.price * 100),
            product_data: { name: product!.name, images: [product!.image] },
          },
        })),
        { quantity: 1, price_data: { currency: 'usd' as const, unit_amount: tax * 100, product_data: { name: 'Estimated tax' } } },
      ],
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shipping * 100, currency: 'usd' },
          display_name: 'Standard shipping',
        },
      }],
      discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : undefined,
      shipping_address_collection: { allowed_countries: ['US', 'CA', 'GB', 'AU'] },
      success_url: `${appUrl()}/checkout?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl()}/checkout?payment=cancelled`,
      metadata: { orderId: order.id, items: JSON.stringify(items), coupon: coupon?.code ?? '' },
    });

    order.paymentId = session.id;
    return NextResponse.json({ checkoutUrl: session.url, sessionId: session.id, orderId: order.id, provider: 'stripe' }, { status: 201 });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Unable to start secure checkout. Please try again.' }, { status: 502 });
  }
}
