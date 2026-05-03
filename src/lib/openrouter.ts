const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';

export interface FoodScanItem {
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

export interface FoodScan {
  items: FoodScanItem[];
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
      "confidence": number between 0 and 1
    }
  ],
  "notes": "string (optional, 1 sentence on assumptions)"
}

If the image does not depict food, return {"items": [], "notes": "no food detected"}.`;

export async function openrouterVisionScan({
  apiKey,
  model,
  imageBase64,
  mimeType,
  siteUrl,
}: {
  apiKey: string;
  model?: string;
  imageBase64: string;
  mimeType: string;
  siteUrl?: string;
}): Promise<FoodScan> {
  if (!apiKey) throw new Error('Missing OpenRouter API key');
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;

  const body = {
    model: model ?? DEFAULT_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: PROMPT },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  };

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (siteUrl) {
    headers['HTTP-Referer'] = siteUrl;
    headers['X-Title'] = 'Soma';
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  const content: string = json?.choices?.[0]?.message?.content ?? '';
  const cleaned = content.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

  try {
    const parsed = JSON.parse(cleaned) as FoodScan;
    if (!Array.isArray(parsed.items)) parsed.items = [];
    return parsed;
  } catch {
    throw new Error('Failed to parse model response as JSON');
  }
}
