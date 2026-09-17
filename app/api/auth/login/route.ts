import { NextResponse } from 'next/server';
import { demoUser } from '@/lib/data';

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginBody;

  if (!body.email || !body.password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  if (body.email !== demoUser.email || body.password !== 'password123') {
    return NextResponse.json({ error: 'Invalid demo credentials.' }, { status: 401 });
  }

  return NextResponse.json({ user: demoUser, token: 'demo-session-token' });
}
