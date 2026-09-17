'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useStore } from '@/components/store-provider';
import { products } from '@/lib/data';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { cart, cartTotal, user, discountAmount, couponCode, clearCart } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      clearCart();
      setComplete(true);
    }
    if (payment === 'cancelled') setError('Payment was cancelled. Your cart is still saved.');
  }, [searchParams]);

  const items = cart.map((entry) => {
    const product = products.find((item) => item.id === entry.productId)!;
    return { ...entry, product };
  });

  const shipping = items.length === 0 ? 0 : 12;
  const tax = Math.round(cartTotal * 0.08);
  const total = cartTotal - discountAmount + shipping + tax;

  if (items.length === 0 && !complete) {
    return (
      <main className="container py-12">
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-black tracking-tight">Your cart is empty</h1>
          <p className="mt-3 text-slate-600">Add a few items before continuing to checkout.</p>
          <Link href="/shop" className="primary-btn mt-6">Browse products</Link>
        </div>
      </main>
    );
  }

  if (complete) {
    return (
      <main className="container py-12">
        <div className="mx-auto max-w-xl rounded-[30px] border border-slate-200 bg-white p-10 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Order placed</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Thank you for shopping</h1>
          <p className="mt-4 text-slate-600">Your order has been confirmed and a receipt has been sent to {user?.email ?? 'your email'}.</p>
          <Link href="/shop" className="primary-btn mt-8">Continue shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-12">
      <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-2xl font-black">Shipping details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input defaultValue={user?.name ?? 'Alex Johnson'} className="rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" placeholder="Full name" />
              <input defaultValue={user?.email ?? 'alex@example.com'} className="rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" placeholder="Email" />
              <input className="md:col-span-2 rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" placeholder="Street address" />
              <input className="rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" placeholder="City" />
              <input className="rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" placeholder="ZIP code" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black">Payment</h2>
            <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-600">Secure payment with Stripe</p>
              <p className="mt-2 text-sm text-slate-500">You will be redirected to Stripe Checkout to enter card details securely.</p>
            </div>
          </div>
        </div>

        <aside className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Order summary</h2>
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                <img src={item.product.image} alt={item.product.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold text-slate-800">{item.product.name}</p>
                  <p className="text-slate-500">Qty {item.quantity}</p>
                </div>
                <span className="font-semibold text-slate-800">${item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal}</span></div>
            <div className="flex justify-between text-emerald-600"><span>Discount {couponCode && `(${couponCode})`}</span><span>-${discountAmount}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${shipping}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax}</span></div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900"><span>Total</span><span>${total}</span></div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              setError('');
              const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: user?.email ?? 'alex@example.com',
                  couponCode,
                  items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
                }),
              });
              const result = await response.json();
              setSubmitting(false);
              if (!response.ok) {
                setError(result.error ?? 'Unable to place order.');
                return;
              }
              if (result.checkoutUrl) {
                window.location.href = result.checkoutUrl;
                return;
              }
              clearCart();
              setComplete(true);
            }}
            className="primary-btn mt-6 w-full justify-center"
          >
            {submitting ? 'Processing...' : 'Place order'}
          </button>
          {error && <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>}
        </aside>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="container py-12"><p className="text-slate-600">Loading checkout...</p></main>}>
      <CheckoutContent />
    </Suspense>
  );
}
