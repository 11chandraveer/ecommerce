import Link from 'next/link';
import { ArrowRight, ChevronRight, Heart, Search, ShoppingBag, Star, Truck, ShieldCheck, Sparkles, BellRing } from 'lucide-react';

const categories = [
  'Electronics',
  'Fashion',
  "Men's Fashion",
  "Women's Fashion",
  'Shoes',
  'Beauty',
  'Home & Kitchen',
  'Accessories',
  'Sports',
  'Gaming',
];

const categorySlugs: Record<string, string> = {
  Electronics: 'electronics',
  Fashion: 'fashion',
  "Men's Fashion": 'mens',
  "Women's Fashion": 'womens',
  Shoes: 'shoes',
  Beauty: 'beauty',
  'Home & Kitchen': 'home',
  Accessories: 'accessories',
  Sports: 'sports',
  Gaming: 'gaming',
};

const products = [
  { name: 'Aero Wireless Headphones', price: 129, originalPrice: 169, rating: 4.8, reviews: 320, discount: 24, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80' },
  { name: 'Urban Smartwatch Pro', price: 189, originalPrice: 239, rating: 4.7, reviews: 210, discount: 21, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80' },
  { name: 'Monarch Leather Jacket', price: 159, originalPrice: 220, rating: 4.9, reviews: 154, discount: 28, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' },
  { name: 'Nova Running Shoes', price: 99, originalPrice: 149, rating: 4.6, reviews: 391, discount: 34, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      <section className="container py-10 md:py-16">
        <div className="grid gap-8 overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 via-violet-950 to-brand-700 p-6 text-white shadow-soft md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-violet-100">
              <Sparkles className="h-4 w-4" />
              New season essentials
            </div>
            <h2 className="max-w-xl text-4xl font-black leading-tight tracking-tight md:text-5xl">Upgrade your everyday with premium essentials.</h2>
            <p className="mt-5 max-w-lg text-base text-violet-100 md:text-lg">Discover handpicked tech, fashion, and lifestyle products designed to bring more comfort, style, and performance to your routine.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100">Shop now <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/shop?sort=featured" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15">Explore deals <ChevronRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-2xl font-black">25k+</p>
                <p className="text-sm text-violet-100">Happy shoppers</p>
              </div>
              <div>
                <p className="text-2xl font-black">4.9/5</p>
                <p className="text-sm text-violet-100">Average rating</p>
              </div>
              <div>
                <p className="text-2xl font-black">48h</p>
                <p className="text-sm text-violet-100">Fast shipping</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-6 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
                alt="Lifestyle shopping
"
                className="h-[420px] w-full rounded-[24px] object-cover"
              />
              <div className="absolute bottom-8 left-8 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Limited offer</p>
                <p className="mt-1 text-2xl font-black">Up to 60% off</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-6 md:py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {['Free shipping', 'Secure payments', 'Easy returns', '24/7 support', 'Member rewards'].map((item, index) => (
            <div key={item} className="glass-card flex items-center gap-3 rounded-2xl p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                {index === 0 ? <Truck className="h-5 w-5" /> : index === 1 ? <ShieldCheck className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-semibold">{item}</p>
                <p className="text-sm text-slate-500">Trusted service</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Browse by category</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">Shop departments</h3>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {categories.map((category, index) => (
            <Link href={`/shop?category=${categorySlugs[category]}`} key={category} className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-violet-100 text-xl font-black text-brand-700">
                {category.charAt(0)}
              </div>
              <p className="font-semibold text-slate-800">{category}</p>
              <p className="mt-2 text-sm text-slate-500">{120 + index * 18} items</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Best picks</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">Featured products</h3>
          </div>
          <Link href="/shop" className="secondary-btn">View all</Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="product-card overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
              <div className="relative">
                <Link href={`/product/${product.name.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                  <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
                </Link>
                <button className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm hover:text-rose-500" aria-label="Add to wishlist">
                  <Heart className="h-4 w-4" />
                </button>
                <span className="absolute left-4 top-4 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">-{product.discount}%</span>
              </div>
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500">{product.reviews} reviews</span>
                </div>
                <Link href={`/product/${product.name.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="block text-lg font-bold text-slate-900 hover:text-brand-700">{product.name}</Link>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-900">${product.price}</span>
                  <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/product/${product.name.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="primary-btn flex-1">View product</Link>
                  <Link href={`/product/${product.name.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="secondary-btn px-3">Quick view</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <div className="rounded-[32px] bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 p-8 text-white shadow-soft md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-100">Flash sale</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight">Weekend deals are live</h3>
            </div>
            <div className="flex gap-3 text-center">
              {['08', '12', '36'].map((item, index) => (
                <div key={index} className="rounded-2xl bg-white/15 px-4 py-3 backdrop-blur-sm">
                  <div className="text-2xl font-black">{item}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-orange-100">{index === 0 ? 'Hrs' : index === 1 ? 'Min' : 'Sec'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Fresh arrivals</p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">Newly added</h3>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80" alt="Arrival 1" className="h-72 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Trending</p>
              <h4 className="mt-3 text-xl font-bold">Crystal sound edition</h4>
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80" alt="Arrival 2" className="h-72 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">Latest style</p>
              <h4 className="mt-3 text-xl font-bold">Minimal fashion collection</h4>
            </div>
          </div>
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80" alt="Arrival 3" className="h-72 w-full object-cover" />
            <div className="p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-brand-600">New in home</p>
              <h4 className="mt-3 text-xl font-bold">Cozy home refresh</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-600">Customer love</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight">What shoppers say</h3>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { name: 'Alicia M.', review: 'The product quality is outstanding and the shipping was faster than expected. Really premium experience.', rating: 5 },
              { name: 'Marcus D.', review: 'Clean design, smooth ordering, and excellent customer support. This is exactly what I wanted.', rating: 5 },
              { name: 'Jenna R.', review: 'Everything from checkout to delivery felt polished. I will definitely order again.', rating: 4 },
            ].map((item) => (
              <div key={item.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < item.rating ? 'fill-current' : 'text-slate-300'}`} />
                  ))}
                </div>
                <p className="text-slate-700">“{item.review}”</p>
                <div className="mt-5 h-px bg-slate-200" />
                <p className="mt-4 font-bold text-slate-900">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="rounded-[28px] bg-slate-900 p-8 text-white shadow-soft md:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Newsletter</p>
              <h3 className="mt-2 text-3xl font-black tracking-tight">Get exclusive deals and product drops.</h3>
            </div>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input type="email" placeholder="Enter your email" className="flex-1 rounded-full border border-slate-700 bg-slate-800 px-5 py-3 text-white placeholder:text-slate-400 outline-none focus:border-violet-400" />
              <button type="submit" className="primary-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

    </main>
  );
}
