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

const PROMPT = `You are a careful nutrition analyst working from a photo. Identify every distinct food item visible and estimate nutrition for each one as eaten.

ESTIMATION RULES — read these carefully:
1. Lean toward over-estimating, not under. People consistently underestimate portion size and forget hidden calories. When in doubt, pick the higher of two plausible numbers.
2. Account for cooking fats and finishing oils even if they are not visible. Sautéed vegetables typically carry 5–15 g of oil. Roasted potatoes / fries carry 8–20 g. A pan-cooked egg carries 3–7 g of butter or oil.
3. Account for dressings, sauces, condiments, butter, cheese, croutons, nuts, seeds, and toppings. Salads with creamy or vinaigrette dressings often add 100–250 kcal. A buttered piece of toast is 50–80 kcal beyond the bread.
4. Account for breading, batter, and frying. A breaded fried protein is roughly 1.4–1.8× the calories of the protein alone.
5. Estimate portion sizes using visual references — utensils (~20 cm fork), hands (~18 cm palm), plates (~25 cm dinner, ~20 cm salad), bowls, cups (~240 ml). State your reference in the notes.
6. For drinks: assume whole milk unless clearly skim. Assume a typical glass of juice / soda is ~300 ml. A pint of beer is ~470 ml.
7. Round grams to the nearest 5, calories to the nearest 5, macros to the nearest 1.
8. If a category is genuinely zero (e.g. fiber in pure butter), use 0, not null.

If the image does not depict food, return {"items": [], "notes": "no food detected"}.

If the user provides additional CONTEXT below, treat it as ground truth and override your visual guesses with it.

Return ONLY valid JSON, no prose, no markdown fences:
{
  "items": [
    {
      "name": "string (concise, e.g. 'grilled chicken breast with butter')",
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
  "notes": "string (1 sentence: portion references used, any assumptions, any hidden ingredients you assumed)"
}`;

export async function openrouterVisionScan({
  apiKey,
  model,
  imageBase64,
  mimeType,
  context,
  siteUrl,
}: {
  apiKey: string;
  model?: string;
  imageBase64: string;
  mimeType: string;
  context?: string;
  siteUrl?: string;
}): Promise<FoodScan> {
  if (!apiKey) throw new Error('Missing OpenRouter API key');
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;

  const userText = context && context.trim()
    ? `${PROMPT}\n\nCONTEXT FROM USER (treat as ground truth):\n${context.trim()}`
    : PROMPT;

  const body = {
    model: model ?? DEFAULT_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: userText },
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
