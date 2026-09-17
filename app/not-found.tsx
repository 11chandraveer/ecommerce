import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">404</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">The page you are looking for doesn’t exist or has moved.</p>
        <Link href="/" className="primary-btn mt-8">Return home</Link>
      </div>
    </main>
  );
}
