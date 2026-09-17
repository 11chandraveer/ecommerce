import { NextResponse } from 'next/server';

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RegisterBody;

  if (!body.name || !body.email || !body.password) {
    return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
  }

  if (body.password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  return NextResponse.json({
    user: { id: `u-${Date.now()}`, name: body.name, email: body.email, role: 'customer' },
    token: 'demo-session-token',
  }, { status: 201 });
}
