'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/lib/types';
import { useStore } from '@/components/store-provider';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();

  return (
    <article className="product-card overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="relative">
        <Link href={`/product/${product.slug}`}>
          <Image src={product.image} alt={product.name} width={900} height={900} priority={product.id === 'p1'} className="h-64 w-full object-cover" />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute right-4 top-4 rounded-full p-2 shadow-sm ${wishlist.includes(product.id) ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-600'}`}
          aria-label={`Toggle wishlist for ${product.name}`}
        >
          <Heart className="h-4 w-4" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
        </button>
        <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">-{product.discount}%</span>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
          </div>
          <span className="text-xs text-slate-500">{product.reviewCount} reviews</span>
        </div>
        <Link href={`/product/${product.slug}`} className="block text-lg font-bold text-slate-900 hover:text-brand-700">{product.name}</Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-slate-900">${product.price}</span>
          <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => addToCart(product.id, 1)} className="primary-btn flex-1">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
          </button>
          <Link href={`/product/${product.slug}`} className="secondary-btn px-3">Quick view</Link>
        </div>
      </div>
    </article>
  );
}
