# Soma

> Calorie & macro tracking through a clean lens.

Free, open-source, privacy-respecting nutrition tracker. Progressive Web App — runs on iOS, Android, and desktop without an app store.

- **Photos never persist.** AI scans send the image to Gemini once, then discard it.
- **Bring-Your-Own-Key** for AI scans (free Gemini key, 1,500 scans/day).
- **Multi-country barcodes** via Open Food Facts + USDA FoodData Central.
- **Fully local.** Your data lives in your browser via IndexedDB. No accounts, no cloud.
- **Open source** under AGPL-3.0.

## Stack

Next.js 15 · Tailwind CSS · Dexie (IndexedDB) · Recharts · next-intl · ZXing · Google Gemini 1.5 Flash.

## Develop

```bash
cp .env.local.example .env.local
# (env vars are optional — the app runs fully without them)

npm install
npm run dev
```

Visit <http://localhost:3000>.

## Deploy to Vercel

1. Push the repo to GitHub.
2. *Import Project* in Vercel — framework auto-detects as Next.js.
3. (Optional) set `NEXT_PUBLIC_USDA_API_KEY` and `NEXT_PUBLIC_SITE_URL`.
4. Deploy.

## Where data lives

Soma stores everything locally in your browser using IndexedDB (Dexie):

- profile, weight logs, food log entries, custom foods, barcode cache
- your Gemini API key in `localStorage`

Use **Settings → Export JSON** to back up. Use **Settings → Clear local data** to wipe.

## Design system

The brand identity (RD9 Graphite Duotone) lives in [`Design/`](Design/). Tokens:

| Token | Value |
|---|---|
| ink | `#18201C` |
| paper | `#F4F0EA` |
| dark | `#171A1F` |
| sand | `#E4DCCD` |
| slate | `oklch(0.62 0.04 240)` |
| slate-deep | `oklch(0.42 0.05 240)` |

Wordmark: lowercase `soma` · Manrope 500 · letter-spacing `-0.05em`.
The mark: gradient progress ring, top-left → bottom-right, round linecap, default 75% pct.

## License

[AGPL-3.0-only](LICENSE). If you run a modified version as a network service, you must offer the modified source to your users.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Translation contributions and bug reports especially welcome.
