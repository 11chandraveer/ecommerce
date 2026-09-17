'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useStore } from '@/components/store-provider';

export default function RegisterPage() {
  const { setUser } = useStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? 'Unable to create account.');
      setSubmitting(false);
      return;
    }

    setUser(result.user);
    setSubmitting(false);
  }

  return (
    <main className="container py-14">
      <div className="mx-auto max-w-xl rounded-[30px] border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600">Create account</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Register</h1>
        <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
            <input required type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none focus:border-brand-500" />
          </div>
          <div className="md:col-span-2">
            {error && <p className="mb-4 text-sm font-medium text-rose-600">{error}</p>}
            <button type="submit" disabled={submitting} className="primary-btn w-full">{submitting ? 'Creating account...' : 'Create account'}</button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-semibold text-brand-700">Login</Link>
        </p>
      </div>
    </main>
  );
}
