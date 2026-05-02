import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Soma — Calorie & macro tracking through a clean lens';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PAPER = '#F4F0EA';
const INK = '#18201C';
const SLATE_DEEP = '#5A6680';
const RING_TRACK = 'rgba(24,32,28,0.08)';

function Ring({ size, pct = 0.75 }: { size: number; pct?: number }) {
  const stroke = Math.round(size * 0.118);
  const r = Math.round(size / 2 - stroke / 2 - size * 0.018);
  const C = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'flex' }}>
      <defs>
        <linearGradient id="og-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={SLATE_DEEP} />
          <stop offset="100%" stopColor={INK} />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={RING_TRACK} strokeWidth={stroke} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="url(#og-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${C * pct} ${C}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </svg>
  );
}

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: PAPER,
          color: INK,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 18,
            color: 'rgba(24,32,28,0.6)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          σῶμα · open source · agpl-3.0
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
          <Ring size={260} pct={0.75} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 740 }}>
            <div
              style={{
                fontSize: 84,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                lineHeight: 1.02,
              }}
            >
              calorie & macro
              <br />
              tracking, clean.
            </div>
            <div style={{ fontSize: 26, color: 'rgba(24,32,28,0.6)', lineHeight: 1.3 }}>
              Free, open-source, privacy-respecting. Photo scans never leave your device.
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 16,
            color: 'rgba(24,32,28,0.6)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          <span>soma · free forever</span>
          <span>RD9 · GRAPHITE DUOTONE</span>
        </div>
      </div>
    ),
    size,
  );
}
