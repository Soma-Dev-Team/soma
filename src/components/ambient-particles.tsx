'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Mote {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
  opacity: number;
}

interface Blob {
  top: string;
  left: string;
  size: number;
  color: string;
  delay: number;
  driftX: number;
  driftY: number;
  duration: number;
}

const BLOBS: Blob[] = [
  { top: '-10%', left: '-8%', size: 520, color: 'var(--macro-protein)', delay: 0, driftX: 40, driftY: 30, duration: 28 },
  { top: '20%', left: '90%', size: 460, color: 'var(--macro-fiber)',  delay: 4, driftX: -50, driftY: 60, duration: 32 },
  { top: '70%', left: '-10%', size: 580, color: 'var(--macro-fat)',    delay: 8, driftX: 60, driftY: -40, duration: 36 },
  { top: '60%', left: '85%', size: 500, color: 'var(--macro-carbs)',  delay: 2, driftX: -30, driftY: -50, duration: 30 },
];

/**
 * Two-layer ambient backdrop:
 *
 * 1. Four big soft gradient blobs anchored to the page corners. Heavily blurred,
 *    very low opacity, drifting slowly. They tint the negative space and bleed
 *    around card edges instead of getting covered by them.
 * 2. A finer SVG mote layer that animates over the same area for fine detail.
 *
 * Both are fixed, pointer-events-none, behind everything via z-0 with
 * backdrop content lifted to z-10.
 */
export function AmbientParticles({ count = 22, className }: { count?: number; className?: string }) {
  const reduce = useReducedMotion();

  const motes: Mote[] = useMemo(() => {
    const out: Mote[] = [];
    for (let i = 0; i < count; i++) {
      const seed = (i + 1) * 1664525;
      const a = (seed >>> 0) % 1000;
      const b = ((seed >>> 4) >>> 0) % 1000;
      const c = ((seed >>> 8) >>> 0) % 1000;
      const d = ((seed >>> 12) >>> 0) % 1000;
      const e = ((seed >>> 16) >>> 0) % 1000;
      out.push({
        cx: (a / 1000) * 100,
        cy: (b / 1000) * 100,
        r: 0.8 + (c / 1000) * 1.6,
        delay: (d / 1000) * 8,
        duration: 18 + (e / 1000) * 18,
        driftX: ((c / 1000) - 0.5) * 8,
        driftY: -3 - (d / 1000) * 8,
        opacity: 0.1 + (e / 1000) * 0.25,
      });
    }
    return out;
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className ?? ''}`}
    >
      {/* Blob layer */}
      {!reduce &&
        BLOBS.map((b, i) => (
          <motion.div
            key={`blob-${i}`}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: [0, b.driftX, 0],
              y: [0, b.driftY, 0],
              opacity: [0, 0.18, 0.18, 0.12, 0.18],
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              delay: b.delay,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: b.top,
              left: b.left,
              width: b.size,
              height: b.size,
              borderRadius: '9999px',
              background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
              filter: 'blur(60px)',
              willChange: 'transform, opacity',
            }}
          />
        ))}

      {/* Mote layer (skipped under reduced-motion) */}
      {!reduce && (
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {motes.map((p, i) => (
            <motion.circle
              key={`mote-${i}`}
              cx={p.cx}
              cy={p.cy}
              r={p.r * 0.18}
              fill="currentColor"
              style={{ color: 'hsl(var(--foreground))' }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, p.opacity, p.opacity, 0],
                cx: [p.cx, p.cx + p.driftX],
                cy: [p.cy, p.cy + p.driftY],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'linear',
              }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
