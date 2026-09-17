'use client';

import Link from 'next/link';
import { useStore } from '@/components/store-provider';
import { demoUser } from '@/lib/data';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const { setUser } = useStore();
  const [email, setEmail] = useState(demoUser.email);
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Unable to log in.');
      setSubmitting(false);
      return;
    }

    setUser(result.user);
    setSubmitting(false);
  }

  return (
    <main className="container py-14">
      <div className="mx-auto max-w-md rounded-[30px] border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Welcome back</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Login</h1>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label>
            <a href="#" className="text-brand-700">Forgot password?</a>
          </div>
          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
          <button type="submit" disabled={submitting} className="primary-btn w-full">{submitting ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account? <Link href="/register" className="font-semibold text-brand-700">Register</Link>
        </p>
      </div>
    </main>
  );
}
