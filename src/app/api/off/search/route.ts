import { NextResponse } from 'next/server';
import { searchOFF } from '@/lib/food/off';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? '';
  if (!q) return NextResponse.json({ foods: [] });
  const foods = await searchOFF(q);
  return NextResponse.json({ foods });
}
