import { NextResponse } from 'next/server';
import { fetchOFFByBarcode, offProductToFood } from '@/lib/food/off';

export const runtime = 'edge';

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const product = await fetchOFFByBarcode(code);
  if (!product?.product) return NextResponse.json({ food: null }, { status: 404 });
  const food = offProductToFood({ ...product.product, code: product.code });
  return NextResponse.json({ food });
}
