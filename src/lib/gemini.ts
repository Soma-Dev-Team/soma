const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiFoodItem {
  name: string;
  grams?: number;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  confidence?: number;
}

export interface GeminiFoodScan {
  items: GeminiFoodItem[];
  notes?: string;
}

const PROMPT = `You are a nutrition analyst. Identify the foods visible in this image and estimate nutrition for each item as eaten.

Return ONLY valid JSON matching this schema, no prose, no markdown fences:
{
  "items": [
    {
      "name": "string (concise, e.g. 'grilled chicken breast')",
      "grams": number,
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "fiber_g": number,
      "sugar_g": number,
      "sodium_mg": number,
      "confidence": number (0-1)
    }
  ],
  "notes": "string (optional, 1 sentence on assumptions)"
}

If the image does not depict food, return {"items": [], "notes": "no food detected"}.`;

export async function geminiScan({
  apiKey,
  imageBase64,
  mimeType,
}: {
  apiKey: string;
  imageBase64: string;
  mimeType: string;
}): Promise<GeminiFoodScan> {
  if (!apiKey) throw new Error('Missing Gemini API key');
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
        ],
      },
    ],
    generationConfig: {
      response_mime_type: 'application/json',
      temperature: 0.2,
    },
  };

  const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = await res.json();
  const text: string =
    json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('') ?? '';
  const cleaned = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    const parsed = JSON.parse(cleaned) as GeminiFoodScan;
    if (!parsed.items) parsed.items = [];
    return parsed;
  } catch (e) {
    throw new Error('Failed to parse Gemini response as JSON');
  }
}

export async function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return { data: btoa(binary), mimeType: file.type || 'image/jpeg' };
}

const STORAGE_KEY = 'soma:gemini_api_key';

export function getStoredGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STORAGE_KEY) ?? '';
}

export function setStoredGeminiKey(key: string) {
  if (typeof window === 'undefined') return;
  if (key) window.localStorage.setItem(STORAGE_KEY, key);
  else window.localStorage.removeItem(STORAGE_KEY);
}
