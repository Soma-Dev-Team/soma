# CLAUDE.md — Soma Logo

Instructions for Claude Code working in this repository.

## What this project is

Design exploration for **Soma**, a calorie-counter / wellness app.
- Greek σῶμα ("body")
- Audience: wellness & balance crowd
- Vibe: modern, calm, restrained

The chosen direction is **RD9 — Graphite Duotone**: a circular progress ring drawn with a linear gradient stroke, paired with a lowercase "soma" wordmark.

## Repository layout

```
Soma Logo.html         # Full exploration canvas (DesignCanvas of all directions)
RD9 Graphite.html      # Primary deliverable page (with tweakable controls)
logos.jsx              # Components used by Soma Logo.html
design-canvas.jsx      # DesignCanvas starter (do not edit)
tweaks-panel.jsx       # Tweaks starter (do not edit)
exports/               # PNG export bundle (lockup, icon, icon+text per palette)
  lockup-{palette}.png
  icon-{palette}.png
  icon-text-{palette}.png
  README.md
```

## Brand tokens

```css
--soma-ink:        #18201C;
--soma-paper:      #F4F0EA;
--soma-dark:       #171A1F;
--soma-midnight:   #0E1722;
--soma-sand:       #E4DCCD;
--soma-slate:      oklch(0.62 0.04 240);
--soma-slate-deep: oklch(0.42 0.05 240);
```

Six approved palettes:
- **dark** — graphite ground, slate→paper gradient ring, paper text
- **mid** — midnight ground, slate→paper gradient ring, paper text
- **deep** — deep slate ground, paper→slate ring, paper text
- **slate** — slate ground, paper→ink ring, paper text
- **light** — paper ground, deep-slate→ink ring, ink text *(primary light)*
- **sand** — warm sand ground, deep-slate→ink ring, ink text

## The mark

```
ring size       220 px (reference; scales freely)
stroke weight   26 px (regular)  — also: thin 17, heavy 34
ring progress   72% by default
start angle     −90° (12 o'clock)
gradient        linear, 0% → 100%, top-left → bottom-right
linecap         round
```

## The wordmark

```
family          Manrope (Google Fonts)
weight          500
case            lowercase ("soma")
size            144 px in primary lockup; ~22% of tile in app icons
letter-spacing  -0.05em
line-height     1
```

Always install Manrope or outline the text when shipping to design tools that don't fetch webfonts.

## Lockups

1. **Horizontal** (primary) — ring + wordmark, 40 px gap, vertically centered.
2. **Stacked** (icon use) — ring above, lowercase wordmark below, 12 px gap.
3. **Mark only** — ring centered on a 240 × 240 tile with 54 px corner radius.

## Icons

- Tile: 240 × 240, corner radius 54 px (≈22.5%).
- Mark only: ring at 66% of tile.
- Stacked: ring at 52% of tile + wordmark beneath.

## Building / running

Static HTML only. To preview:

```bash
python3 -m http.server 8080
# then open http://localhost:8080/Soma%20Logo.html
```

Or open files directly in a browser. No build step.

## When adding new variants

- Add components to `logos.jsx`. Wrap in `<DCArtboard>` inside a `<DCSection>` in the `App()` block.
- Reuse the `Ring` and `GraphiteRing` helpers — never hand-roll new ring math; keep proportions consistent across the system.
- Stick to the six palettes unless the user explicitly approves a new one.

## Tweaks panel (RD9 Graphite.html)

Persisted defaults live between `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` markers. Editing those values changes the page on reload.

## Don'ts

- No emoji in the brand.
- No celestial/moon shapes (the split-circle direction was rejected).
- No new accent colors without approval — slate is the only chromatic accent.
- Don't substitute Manrope with Inter/Roboto/Arial.

