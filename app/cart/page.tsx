'use client';

import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/components/store-provider';
import { products } from '@/lib/data';
import { useState } from 'react';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, couponCode, discountAmount, applyCoupon, removeCoupon, clearCart } = useStore();
  const [couponInput, setCouponInput] = useState(couponCode);
  const [couponError, setCouponError] = useState('');

  const items = cart.map((entry) => {
    const product = products.find((item) => item.id === entry.productId)!;
    return { ...entry, product };
  });

  return (
    <main className="container py-12">
      <h1 className="text-4xl font-black tracking-tight">Shopping cart</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-xl font-semibold">Your cart is empty</p>
          <Link href="/shop" className="primary-btn mt-6">Continue shopping</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-600">{cart.length} product types · {cart.reduce((total, item) => total + item.quantity, 0)} items</p>
              <button type="button" onClick={clearCart} className="text-sm font-semibold text-rose-600">Clear cart</button>
            </div>
            {items.map((item) => (
              <div key={item.productId} className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
                <img src={item.product.image} alt={item.product.name} className="h-28 w-full rounded-2xl object-cover sm:w-32" />
                <div className="flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{item.product.name}</h2>
                      <p className="text-sm text-slate-500">{item.product.brand}</p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.productId)} className="text-rose-500"><Trash2 className="h-5 w-5" /></button>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-slate-200">
                      <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)} className="p-2 text-slate-700"><Minus className="h-4 w-4" /></button>
                      <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(item.productId, item.quantity + 1)} className="p-2 text-slate-700"><Plus className="h-4 w-4" /></button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">${item.product.price * item.quantity}</p>
                      <p className="text-sm text-slate-500">${item.product.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black">Summary</h2>
            <div className="mt-5 flex gap-2">
              <input value={couponInput} onChange={(event) => setCouponInput(event.target.value.toUpperCase())} placeholder="Coupon code" className="min-w-0 flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-500" />
              <button type="button" onClick={() => { setCouponError(applyCoupon(couponInput) ? '' : 'Coupon is invalid or minimum order is not met.'); }} className="secondary-btn px-4 py-2">Apply</button>
            </div>
            {couponError && <p className="mt-2 text-xs font-medium text-rose-600">{couponError}</p>}
            {couponCode && <p className="mt-2 text-xs font-medium text-emerald-600">{couponCode} applied <button type="button" onClick={removeCoupon} className="ml-1 underline">Remove</button></p>}
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>${cartTotal}</span></div>
              <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-${discountAmount}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>$12</span></div>
              <div className="flex justify-between"><span>Tax</span><span>$8</span></div>
              <div className="flex justify-between font-semibold text-slate-900"><span>Total</span><span>${cartTotal - discountAmount + 20}</span></div>
            </div>
            <Link href="/checkout" className="primary-btn mt-6 w-full">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </main>
  );
}
