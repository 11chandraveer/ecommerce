'use client';

import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { useStore } from '@/components/store-provider';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=electronics', label: 'Categories' },
  { href: '/shop?sort=featured', label: 'Deals' },
  { href: '/shop?sort=newest', label: 'New Arrivals' },
  { href: '/dashboard', label: 'Account' },
  { href: '/admin', label: 'Admin' },
];

export function SiteHeader() {
  const { cartCount, wishlistCount, user } = useStore();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-black text-white">L</div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Premium</p>
            <h1 className="text-xl font-black tracking-tight">LuxeCart</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 items-center justify-center px-4 xl:flex">
          <div className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500 shadow-sm">
            <Search className="h-4 w-4" />
            <input aria-label="Search" placeholder="Search products, brands, categories" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/wishlist" className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-brand-200 hover:text-brand-700" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{wishlistCount}</span>}
          </Link>
          <Link href="/cart" className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-brand-200 hover:text-brand-700" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">{cartCount}</span>}
          </Link>
          <Link href={user ? '/dashboard' : '/login'} className="hidden rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 md:inline-flex">
            <User className="h-5 w-5" />
          </Link>
          <Link href="/login" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 md:inline-flex">Login</Link>
          <Link href="/register" className="primary-btn hidden sm:inline-flex">Register</Link>
          <button className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
