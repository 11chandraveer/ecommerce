'use client';

import Link from 'next/link';
import { useStore } from '@/components/store-provider';
import { products } from '@/lib/data';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useStore();
  const items = products.filter((product) => wishlist.includes(product.id));

  return (
    <main className="container py-12">
      <h1 className="text-4xl font-black tracking-tight">Wishlist</h1>
      {items.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-xl font-semibold">No saved items yet</p>
          <Link href="/shop" className="primary-btn mt-6">Discover products</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <div key={product.id} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
              <img src={product.image} alt={product.name} className="h-60 w-full rounded-2xl object-cover" />
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">{product.name}</h2>
                  <p className="text-sm text-slate-500">${product.price}</p>
                </div>
                <button type="button" onClick={() => toggleWishlist(product.id)} className="rounded-full bg-rose-500 px-3 py-2 text-sm font-semibold text-white">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
