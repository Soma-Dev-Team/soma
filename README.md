# Soma

> Calorie & macro tracking through a clean lens.

Free, open-source, privacy-respecting nutrition tracker. Progressive Web App — runs on iOS, Android, and desktop without an app store.

- **Photos never persist.** AI scans send the image to Gemini once, then discard it.
- **Bring-Your-Own-Key** for AI scans (free Gemini key, 1,500 scans/day).
- **Multi-country barcodes** via Open Food Facts + USDA FoodData Central.
- **Local-first** via IndexedDB; syncs to Supabase when signed in.
- **Open source** under AGPL-3.0.

## Stack

Next.js 15 · Tailwind CSS · Supabase (Postgres + Auth) · Dexie (IndexedDB) · Recharts · next-intl · ZXing · Google Gemini 1.5 Flash.

## Develop

```bash
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (optional — app works fully offline without them)

npm install
npm run dev
```

Visit <http://localhost:3000>.

## Supabase setup

1. Create a project in the **EU region** (privacy + GDPR).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. In Auth → Providers, enable Google + Email + Magic link.
4. Copy the project URL and anon key into `.env.local`.

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
