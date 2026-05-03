import { NextResponse } from 'next/server';
import { openrouterVisionScan } from '@/lib/openrouter';

export const runtime = 'edge';
export const maxDuration = 30;

const MAX_BYTES = 8 * 1024 * 1024;

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI scan is not configured on this deployment.' },
      { status: 501 },
    );
  }

  const ct = req.headers.get('content-type') ?? '';
  if (!ct.startsWith('multipart/form-data')) {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Could not parse upload' }, { status: 400 });
  }

  const file = form.get('image');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 8 MB)' }, { status: 413 });
  }
  const context = (form.get('context') as string | null)?.slice(0, 1000) ?? undefined;

  let imageBase64: string;
  try {
    const buf = await file.arrayBuffer();
    imageBase64 = bufferToBase64(buf);
  } catch {
    return NextResponse.json({ error: 'Could not read image' }, { status: 400 });
  }

  try {
    const scan = await openrouterVisionScan({
      apiKey,
      model: process.env.OPENROUTER_MODEL,
      imageBase64,
      mimeType: file.type || 'image/jpeg',
      context,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    });
    return NextResponse.json(scan);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Scan failed' }, { status: 500 });
  }
}
