'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Package, RefreshCw, Search, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { Product } from '@/lib/types';

type AdminOrder = { id: string; email: string; total: number; status: string; createdAt: string };
type Tab = 'overview' | 'orders' | 'inventory';

const sampleOrders: AdminOrder[] = [
  { id: '#1042', email: 'alicia@example.com', total: 214, status: 'confirmed', createdAt: '2026-09-15T09:12:00.000Z' },
  { id: '#1041', email: 'marcus@example.com', total: 98, status: 'processing', createdAt: '2026-09-14T14:25:00.000Z' },
  { id: '#1040', email: 'jenna@example.com', total: 189, status: 'shipped', createdAt: '2026-09-13T11:45:00.000Z' },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function StatCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof DollarSign }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="rounded-2xl bg-brand-50 p-2 text-brand-700"><Icon className="h-5 w-5" /></div>
      </div>
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-2 text-xs font-semibold text-emerald-600">{detail}</p>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>(sampleOrders);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadAdminData() {
    setLoading(true);
    setError('');
    try {
      const [productsResponse, ordersResponse] = await Promise.all([fetch('/api/products'), fetch('/api/orders')]);
      if (!productsResponse.ok || !ordersResponse.ok) throw new Error('Unable to load admin data.');
      const productsResult = await productsResponse.json();
      const ordersResult = await ordersResponse.json();
      setProducts(productsResult.products ?? []);
      if (ordersResult.orders?.length) setOrders(ordersResult.orders);
    } catch {
      setError('Could not refresh admin data. Showing the last available view.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadAdminData(); }, []);

  const filteredProducts = useMemo(() => products.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const filteredOrders = useMemo(() => orders.filter((order) => `${order.id} ${order.email} ${order.status}`.toLowerCase().includes(query.toLowerCase())), [orders, query]);
  const revenue = orders.reduce((total, order) => total + order.total, 0);
  const lowStock = products.filter((product) => product.stock < 20).length;

  function exportOrders() {
    const rows = orders.map((order) => `${order.id},${order.email},${order.total},${order.status},${order.createdAt}`);
    const csv = ['Order,Customer,Total,Status,Date', ...rows].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'luxecart-orders.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container py-8 sm:py-12">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Admin workspace</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Store operations</h1>
          <p className="mt-2 text-slate-600">Monitor sales, orders, and inventory from one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => void loadAdminData()} className="secondary-btn"><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
          <button type="button" onClick={exportOrders} className="primary-btn"><Download className="mr-2 h-4 w-4" /> Export orders</button>
        </div>
      </div>

      {error && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div>}

      <div className="mb-8 flex gap-2 overflow-x-auto border-b border-slate-200">
        {(['overview', 'orders', 'inventory'] as Tab[]).map((item) => (
          <button key={item} type="button" onClick={() => setTab(item)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold capitalize ${tab === item ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{item}</button>
        ))}
      </div>

      <div className="mb-8 flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Search className="h-5 w-5 text-slate-400" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === 'inventory' ? 'Search products or categories' : 'Search orders or customers'} className="w-full bg-transparent text-sm outline-none" />
      </div>

      {tab === 'overview' && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Revenue" value={`$${revenue.toLocaleString()}`} detail="From loaded orders" icon={DollarSign} />
            <StatCard label="Orders" value={orders.length.toLocaleString()} detail="All order records" icon={ShoppingCart} />
            <StatCard label="Products" value={products.length.toLocaleString()} detail={`${lowStock} low stock`} icon={Package} />
            <StatCard label="Customers" value={new Set(orders.map((order) => order.email)).size.toLocaleString()} detail="Unique buyers" icon={Users} />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Last 7 periods</p>
              <h2 className="mt-1 text-2xl font-black">Sales overview</h2>
              <div className="mt-6 grid grid-cols-7 gap-3">
                {[32, 48, 36, 58, 42, 74, 68].map((height, index) => <div key={height + index} className="flex h-40 items-end"><div className="w-full rounded-t-xl bg-gradient-to-t from-brand-600 to-brand-300" style={{ height: `${height}%` }} /></div>)}
              </div>
            </section>
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between"><h2 className="text-2xl font-black">Recent orders</h2><button type="button" onClick={() => setTab('orders')} className="text-sm font-semibold text-brand-700">View all</button></div>
              <div className="mt-5 space-y-3">{orders.slice(0, 4).map((order) => <div key={order.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3"><div><p className="font-semibold">{order.id}</p><p className="text-sm text-slate-500">{order.email}</p></div><div className="text-right"><p className="font-semibold">${order.total}</p><p className="text-xs text-brand-700">{statusLabel(order.status)}</p></div></div>)}</div>
            </section>
          </div>
        </>
      )}

      {tab === 'orders' && <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="text-2xl font-black">Orders</h2><p className="mt-1 text-sm text-slate-500">{filteredOrders.length} matching records</p></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredOrders.map((order) => <tr key={order.id}><td className="px-6 py-4 font-semibold">{order.id}</td><td className="px-6 py-4 text-slate-600">{order.email}</td><td className="px-6 py-4 text-slate-600">{formatDate(order.createdAt)}</td><td className="px-6 py-4 font-semibold">${order.total}</td><td className="px-6 py-4"><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{statusLabel(order.status)}</span></td></tr>)}</tbody></table></div>{filteredOrders.length === 0 && <p className="p-10 text-center text-slate-500">No orders match this search.</p>}</section>}

      {tab === 'inventory' && <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="text-2xl font-black">Inventory</h2><p className="mt-1 text-sm text-slate-500">{filteredProducts.length} products loaded from the catalog</p></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Category</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredProducts.map((product) => <tr key={product.id}><td className="px-6 py-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="h-10 w-10 rounded-xl object-cover" /><span className="font-semibold">{product.name}</span></div></td><td className="px-6 py-4 capitalize text-slate-600">{product.category}</td><td className="px-6 py-4 font-semibold">${product.price}</td><td className="px-6 py-4">{product.stock}</td><td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.stock < 20 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{product.stock < 20 ? 'Low stock' : 'In stock'}</span></td></tr>)}</tbody></table></div></section>}
    </main>
  );
}
