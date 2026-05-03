'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Particle {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
  opacity: number;
}

/**
 * A fixed-position SVG layer of slow-drifting motes. Sits behind the app
 * content (z-0, pointer-events-none) so it never interferes with interaction.
 * Motes are deterministic (seeded by index) so they don't reshuffle on every
 * render or hydrate mismatch.
 */
export function AmbientParticles({
  count = 18,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const particles: Particle[] = useMemo(() => {
    const out: Particle[] = [];
    for (let i = 0; i < count; i++) {
      // Cheap deterministic pseudo-random sequence
      const seed = (i + 1) * 1664525;
      const r = (seed >>> 0) % 1000;
      const a = ((seed >>> 4) >>> 0) % 1000;
      const b = ((seed >>> 8) >>> 0) % 1000;
      const c = ((seed >>> 12) >>> 0) % 1000;
      const d = ((seed >>> 16) >>> 0) % 1000;
      out.push({
        cx: (r / 1000) * 100,
        cy: (a / 1000) * 100,
        r: 0.6 + (b / 1000) * 1.6,
        delay: (c / 1000) * 8,
        duration: 14 + (d / 1000) * 16,
        driftX: ((b / 1000) - 0.5) * 6,
        driftY: -2 - (c / 1000) * 6,
        opacity: 0.06 + (d / 1000) * 0.18,
      });
    }
    return out;
  }, [count]);

  if (reduce) return null;

  return (
    <svg
      className={`pointer-events-none fixed inset-0 z-0 ${className ?? ''}`}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r * 0.15}
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
  );
}
