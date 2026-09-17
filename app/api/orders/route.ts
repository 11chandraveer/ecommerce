import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/api-store';

export function GET() {
  return NextResponse.json({ orders: getOrders() });
}
