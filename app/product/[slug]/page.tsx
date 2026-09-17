'use client';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { Heart, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useStore } from '@/components/store-provider';
import { products } from '@/lib/data';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = products.find((item) => item.slug === params.slug);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const related = useMemo(
    () => products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3),
    [product.category, product.id],
  );

  const safeSelectedColor = selectedColor ?? product.colors[0];
  const safeSelectedSize = selectedSize ?? product.sizes[0];

  return (
    <main className="container py-12">
      <div className="mb-8 text-sm text-slate-500">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-brand-700">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
            <img src={product.gallery[selectedImage] ?? product.image} alt={product.name} className="h-[440px] w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {product.gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-2xl border ${selectedImage === index ? 'border-brand-500' : 'border-slate-200'} bg-white p-1`}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} className="h-24 w-full rounded-xl object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 text-amber-500">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
            <span className="text-sm text-slate-500">({product.reviewCount} reviews)</span>
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight">{product.name}</h1>
          <p className="mt-4 text-lg text-slate-600">{product.description}</p>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-black">${product.price}</span>
            <span className="text-lg text-slate-400 line-through">${product.originalPrice}</span>
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-600">Save {product.discount}%</span>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${safeSelectedColor === color ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${safeSelectedSize === size ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-700'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-slate-200 bg-white">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="p-2 text-slate-700"><Minus className="h-4 w-4" /></button>
              <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)} className="p-2 text-slate-700"><Plus className="h-4 w-4" /></button>
            </div>
            <button type="button" onClick={() => addToCart(product.id, quantity)} className="primary-btn flex-1 justify-center">
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to cart
            </button>
            <button type="button" onClick={() => toggleWishlist(product.id)} className={`rounded-full border p-3 ${wishlist.includes(product.id) ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-700'}`} aria-label={`Toggle wishlist for ${product.name}`}>
              <Heart className="h-5 w-5" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-8 space-y-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Truck className="h-5 w-5 text-brand-600" />
              <span>Free shipping on orders over $120</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <span>Secure checkout and easy returns</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-black tracking-tight">You may also like</h2>
          <Link href="/shop" className="text-sm font-semibold text-brand-700">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <Link key={item.id} href={`/product/${item.slug}`} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1">
              <img src={item.image} alt={item.name} className="h-52 w-full rounded-2xl object-cover" />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">${item.price}</p>
                </div>
                <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">-{item.discount}%</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
