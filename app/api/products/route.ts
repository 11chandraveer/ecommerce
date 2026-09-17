import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/api-store';

export function GET() {
  return NextResponse.json({ products: getProducts() });
}
