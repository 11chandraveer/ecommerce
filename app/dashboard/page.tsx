import { demoUser } from '@/lib/data';

export default function DashboardPage() {
  return (
    <main className="container py-12">
      <h1 className="text-4xl font-black tracking-tight">Welcome back, {demoUser.name}</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Total orders', value: '24' },
          { label: 'Pending', value: '3' },
          { label: 'Delivered', value: '18' },
          { label: 'Wishlist', value: '11' },
          { label: 'Reviews', value: '8' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Recent orders</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-600">
            <li className="flex justify-between border-b border-slate-100 pb-2"><span>#10023</span><span>Delivered</span></li>
            <li className="flex justify-between border-b border-slate-100 pb-2"><span>#10018</span><span>Shipping</span></li>
            <li className="flex justify-between"><span>#10012</span><span>Confirmed</span></li>
          </ul>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Account info</h2>
          <div className="mt-5 space-y-2 text-sm text-slate-600">
            <p>Name: {demoUser.name}</p>
            <p>Email: {demoUser.email}</p>
            <p>Member since: 2024</p>
          </div>
        </div>
      </div>
    </main>
  );
}
