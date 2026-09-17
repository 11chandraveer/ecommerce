'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ProductCard } from '@/components/product-card';
import { categories, products } from '@/lib/data';

function ShopContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') ?? 'all');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'featured');
  const [priceMax, setPriceMax] = useState(250);

  const filteredProducts = useMemo(() => {
    const normalized = products.filter((product) => {
      const matchesSearch = [product.name, product.brand, product.category, product.description].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesPrice = product.price <= priceMax;
      return matchesSearch && matchesCategory && matchesPrice;
    });

    const sorted = [...normalized];
    switch (sort) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      default:
        return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }
  }, [category, priceMax, search, sort]);

  return (
    <main className="container py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Browse</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Shop collection</h1>
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
          {filteredProducts.length} items
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Search</label>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="w-full rounded-full border border-slate-200 px-4 py-2.5 outline-none focus:border-brand-500" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-full border border-slate-200 px-4 py-2.5 outline-none focus:border-brand-500">
              <option value="all">All categories</option>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Max price: ${priceMax}</label>
            <input type="range" min="50" max="350" value={priceMax} onChange={(event) => setPriceMax(Number(event.target.value))} className="w-full" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Sort by</label>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="w-full rounded-full border border-slate-200 px-4 py-2.5 outline-none focus:border-brand-500">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </aside>

        <section className="space-y-6">
          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-12 text-center">
              <h2 className="text-2xl font-black">No products matched your filters</h2>
              <p className="mt-3 text-slate-600">Try adjusting your search, price range, or category selection.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<main className="container py-12"><p className="text-slate-600">Loading shop...</p></main>}>
      <ShopContent />
    </Suspense>
  );
}
