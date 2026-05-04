'use client';

import { format } from 'date-fns';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export function TodayHeader({ streak }: { streak: number }) {
  const today = new Date();
  const datePretty = format(today, 'EEEE · MMMM d');

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between"
    >
      <div className="label-mono text-muted-foreground">{datePretty}</div>
      {streak > 0 && (
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1"
          title={`${streak}-day streak`}
        >
          <Flame size={13} className="text-foreground" />
          <span className="num text-xs font-medium">{streak}</span>
          <span className="label-mono text-muted-foreground">DAY</span>
        </motion.div>
      )}
    </motion.div>
  );
}
