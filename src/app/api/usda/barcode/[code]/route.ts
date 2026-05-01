import { NextResponse } from 'next/server';
import { fetchUSDAByGTIN } from '@/lib/food/usda';

export const runtime = 'edge';

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const food = await fetchUSDAByGTIN(code);
  if (!food) return NextResponse.json({ food: null }, { status: 404 });
  return NextResponse.json({ food });
}
