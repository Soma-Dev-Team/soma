# Contributing to Soma

Welcome. Soma is small enough that every PR matters.

## Local development

```bash
cp .env.local.example .env.local
npm install
npm run dev
npm run typecheck
npm run lint
```

The app is fully local — no backend, no accounts. Everything lives in IndexedDB on the device.

## Branch & PR conventions

- Branch from `main`. Use a short kebab-case branch name: `feat/water-tracking`, `fix/barcode-ean8`, `docs/privacy-clarity`.
- Keep PRs focused. One feature or one bug per PR.
- Write the PR description as a bullet list of what changed and a one-line "why."
- Test on a real iPhone if your change touches camera, file upload, or PWA install. iOS Safari is the trickiest target.

## Translations

Strings live in `messages/{locale}.json`. To add a locale:

1. Copy `messages/en.json` to `messages/<locale>.json` and translate.
2. Add the locale to `SUPPORTED_LOCALES` in `src/i18n.ts`.
3. Open a PR.

## Code style

- TypeScript strict mode. No `any` unless commented why.
- Functional React — no class components.
- Tailwind for styling. Components live in `src/components`. Reusable primitives go in `src/components/ui`.
- Match the design system. Don't introduce new accent colors without proposing in an issue first.

## Brand & design

The Soma identity (RD9 Graphite Duotone) is intentionally restrained. Before submitting a UI change:

- Lowercase `soma` wordmark only — no caps, no tracking changes.
- One accent at a time. Slate is the only chromatic accent.
- No emoji in the brand. No celestial/moon shapes.

## License

By contributing you agree your work is licensed under AGPL-3.0-only.
