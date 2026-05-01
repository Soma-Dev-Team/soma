import { NextResponse } from 'next/server';
import { searchUSDA } from '@/lib/food/usda';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  if (!q) return NextResponse.json({ foods: [] });
  const foods = await searchUSDA(q);
  return NextResponse.json({ foods });
}
