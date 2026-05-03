'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Mounts the page contents with a single fade-up so route changes have a
 * subtle pulse instead of snapping in.
 */
export function PageShell({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay } },
  };
  return (
    <motion.div initial="hidden" animate="show" variants={variants} className={cn('space-y-5', className)}>
      {children}
    </motion.div>
  );
}

/**
 * Stagger the children of a page when they're a list of cards/sections.
 */
export function PageStagger({
  children,
  className,
  gap = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  const reduce = useReducedMotion();
  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : gap, delayChildren: 0.05 } },
  };
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className={cn('space-y-5', className)}>
      {children}
    </motion.div>
  );
}

export const stackItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};
